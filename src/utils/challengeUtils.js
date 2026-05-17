const PROMPT_FIELDS = ['prompt', 'hintPrompt', 'fixedPrompt', 'helpPrompt'];

export function getChallengePrompt(challenge) {
  return PROMPT_FIELDS.map((field) => challenge[field])
    .find((value) => typeof value === 'string' && value.trim().length > 0)
    ?.trim();
}
