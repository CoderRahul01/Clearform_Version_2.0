/**
 * If/Then logic evaluation and navigation resolution.
 */

const toNumber = (v) => {
  if (v === '' || v == null) return NaN;
  const n = Number(v);
  return Number.isFinite(n) ? n : NaN;
};

const toString = (v) => (v == null ? '' : String(v).trim());

/** Build normalized field-id → answer map from ContentCard preview snap */
export function buildLogicAnswersFromScreen(screen, snap) {
  if (!screen || !snap) return {};
  const pf = (k, def = '') => String(snap.previewFields?.[k] ?? def).trim();
  const label = screen.label;
  const answers = {};

  if (label === 'Rating') {
    answers.rating = snap.ratingValue ?? 0;
    answers['opinion-scale'] = snap.ratingValue ?? 0;
    answers.ranking = snap.ratingValue ?? 0;
  }

  if (label === 'Short text') {
    answers['short-text'] = String(snap.shortTextDraft ?? '').trim();
  }
  if (label === 'Long text') {
    answers['long-text'] = String(snap.longTextDraft ?? '').trim();
  }

  if (label === 'Contact') {
    answers['contact-info'] = [pf('c.fn'), pf('c.ln'), pf('c.em')].filter(Boolean).join(' ');
    answers.email = pf('c.em');
    answers['phone-number'] = pf('c.ph');
  }

  if (label === 'Address') {
    answers.address = [pf('a.st'), pf('a.ci'), pf('a.ste'), pf('a.po')].filter(Boolean).join(', ');
  }

  if (label === 'Single' || label === 'Multiple') {
    const picks = snap.previewPicks ?? [];
    answers['multiple-choice'] = picks[0] ?? '';
    answers['picture-choice'] = picks[0] ?? '';
  }

  if (label === 'Media') {
    const picks = snap.previewPicks ?? [];
    answers['picture-choice'] = picks[0] ?? '';
    answers['multiple-choice'] = picks.length;
  }

  if (label === 'Date' || label === 'Time') {
    answers.date = pf('dateAns');
    answers.number = pf('numAns');
  }

  if (label === 'Video') {
    answers['video-audio'] = pf('videoAns');
  }

  if (label === 'Upload' || label === 'Multi-image upload') {
    answers['file-upload'] = pf('uploadAns') || 'uploaded';
  }

  if (label === 'Heading') {
    answers['short-text'] = pf('headingAns');
  }
  if (label === 'Description') {
    answers['long-text'] = pf('descAns');
  }

  return answers;
}

export function evaluateCondition(answer, condition) {
  const { fieldId, operator, value } = condition;
  const target = value ?? '';

  const numAnswer = toNumber(answer);
  const numTarget = toNumber(target);
  const useNumeric = !Number.isNaN(numAnswer) && !Number.isNaN(numTarget);

  if (useNumeric) {
    switch (operator) {
      case 'gt':
        return numAnswer > numTarget;
      case 'lt':
        return numAnswer < numTarget;
      case 'eq':
        return numAnswer === numTarget;
      case 'neq':
        return numAnswer !== numTarget;
      case 'gte':
        return numAnswer >= numTarget;
      case 'lte':
        return numAnswer <= numTarget;
      default:
        return false;
    }
  }

  const a = toString(answer).toLowerCase();
  const t = toString(target).toLowerCase();

  switch (operator) {
    case 'eq':
      return a === t;
    case 'neq':
      return a !== t;
    case 'gt':
      return a > t;
    case 'lt':
      return a < t;
    case 'gte':
      return a >= t;
    case 'lte':
      return a <= t;
    case 'contains':
      return t.length > 0 && a.includes(t);
    case 'not_contains':
      return t.length === 0 || !a.includes(t);
    case 'is_empty':
      return a.length === 0;
    case 'is_not_empty':
      return a.length > 0;
    default:
      return false;
  }
}

/** All conditions in a rule must match (AND) */
export function evaluateRule(rule, answersByFieldId) {
  const conditions = rule?.conditions ?? [];
  if (!conditions.length) return false;
  return conditions.every((c) => {
    const answer = answersByFieldId[c.fieldId];
    return evaluateCondition(answer, c);
  });
}

export const logicEdgeKey = (fromId, toId) => `${fromId}-${toId}`;

/**
 * Resolve next screen when leaving `fromScreenId`.
 * Priority: per-edge if-rules (first matching connection) → else fallback → graph edges → linear order
 */
export function resolveNextScreenId({
  fromScreenId,
  screens,
  logicIfRulesByEdge = {},
  logicElseByScreen = {},
  logicIfRulesByScreen = {},
  logicConnections = [],
  answersByScreenId = {},
}) {
  const from = screens.find((s) => s.id === fromScreenId);
  if (!from) return null;

  const answers = answersByScreenId[fromScreenId] ?? {};
  const ifEdges = logicConnections
    .filter((c) => c.from === fromScreenId && c.kind === 'if')
    .sort((a, b) => a.to - b.to);

  for (const edge of ifEdges) {
    const edgeRules = logicIfRulesByEdge[logicEdgeKey(edge.from, edge.to)];
    if (!edgeRules?.rules?.length) continue;
    for (const rule of edgeRules.rules) {
      if (evaluateRule(rule, answers)) {
        return edge.to;
      }
    }
  }

  if (logicElseByScreen[fromScreenId] != null) {
    return logicElseByScreen[fromScreenId];
  }

  const screenRules = logicIfRulesByScreen[fromScreenId];
  if (screenRules?.rules?.length) {
    for (const rule of screenRules.rules) {
      if (evaluateRule(rule, answers) && rule.thenScreenId != null) {
        return rule.thenScreenId;
      }
    }
    if (screenRules.elseScreenId != null) {
      return screenRules.elseScreenId;
    }
  }

  const outgoing = logicConnections.filter((c) => c.from === fromScreenId && c.kind != null);
  const ifEdge = outgoing.find((c) => c.kind === 'if');
  if (ifEdge?.to != null) return ifEdge.to;

  const nextEdge = outgoing.find((c) => c.kind === 'next');
  if (nextEdge?.to != null) return nextEdge.to;

  const skipEdge = outgoing.find((c) => c.kind === 'skip');
  if (skipEdge?.to != null) return skipEdge.to;

  const endEdge = outgoing.find((c) => c.kind === 'end');
  if (endEdge?.to != null) return endEdge.to;

  const idx = screens.findIndex((s) => s.id === fromScreenId);
  if (idx >= 0 && idx < screens.length - 1) {
    return screens[idx + 1].id;
  }
  return null;
}

export function getOperatorsForFieldId(fieldId) {
  const numericFields = new Set([
    'rating',
    'opinion-scale',
    'ranking',
    'number',
    'date',
  ]);
  const textFields = new Set([
    'short-text',
    'long-text',
    'email',
    'contact-info',
    'address',
    'phone-number',
    'video-audio',
    'file-upload',
  ]);

  if (numericFields.has(fieldId)) {
    return [
      { id: 'gt', label: 'is greater than' },
      { id: 'lt', label: 'is less than' },
      { id: 'eq', label: 'is equal to' },
      { id: 'neq', label: 'is not equal to' },
      { id: 'gte', label: 'is greater than or equal to' },
      { id: 'lte', label: 'is less than or equal to' },
    ];
  }

  if (textFields.has(fieldId)) {
    return [
      { id: 'eq', label: 'is equal to' },
      { id: 'neq', label: 'is not equal to' },
      { id: 'contains', label: 'contains' },
      { id: 'not_contains', label: 'does not contain' },
      { id: 'is_empty', label: 'is empty' },
      { id: 'is_not_empty', label: 'is not empty' },
    ];
  }

  if (fieldId === 'multiple-choice' || fieldId === 'picture-choice') {
    return [
      { id: 'eq', label: 'is' },
      { id: 'neq', label: 'is not' },
      { id: 'is_empty', label: 'is empty' },
      { id: 'is_not_empty', label: 'is not empty' },
    ];
  }

  return [
    { id: 'gt', label: 'is greater than' },
    { id: 'lt', label: 'is less than' },
    { id: 'eq', label: 'is equal to' },
    { id: 'neq', label: 'is not equal to' },
  ];
}

export function isNumericFieldId(fieldId) {
  return getOperatorsForFieldId(fieldId).some((o) => o.id === 'gt');
}

export function validateIfThenDraft(draft, destinationOptions) {
  const errors = [];
  const destIds = new Set(destinationOptions.map((d) => Number(d.id)));

  if (!draft?.rules?.length) {
    errors.push('Add at least one rule.');
  }

  draft?.rules?.forEach((rule, i) => {
    if (rule.thenScreenId == null || !destIds.has(Number(rule.thenScreenId))) {
      errors.push(`Rule ${i + 1}: choose a destination screen.`);
    }
    rule.conditions?.forEach((c, j) => {
      if (!c.fieldId) errors.push(`Rule ${i + 1}, condition ${j + 1}: choose a field.`);
      const emptyVal = c.value === '' || c.value == null;
      const noValueOp = c.operator === 'is_empty' || c.operator === 'is_not_empty';
      if (!noValueOp && emptyVal && isNumericFieldId(c.fieldId)) {
        errors.push(`Rule ${i + 1}, condition ${j + 1}: enter a value.`);
      }
    });
  });

  if (draft?.elseScreenId != null && !destIds.has(Number(draft.elseScreenId))) {
    errors.push('Choose an else (fallback) destination.');
  }

  return errors;
}
