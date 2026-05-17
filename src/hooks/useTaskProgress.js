import { useMemo, useState } from 'react';

const CHALLENGE_ORDER = ['Basic', 'Plus', 'Challenge'];

function getChallengeId(challenge, index) {
  return `${challenge.level ?? 'challenge'}-${index}`;
}

function areAllItemsChecked(items = [], checkedItems = {}) {
  return items.length > 0 && items.every((_, index) => checkedItems[index]);
}

function getTaskProgress(task, progress) {
  return progress[task.id] ?? { acceptance: {}, challenges: {} };
}

export function useTaskProgress(tasks) {
  const [progress, setProgress] = useState({});

  const tasksById = useMemo(
    () => Object.fromEntries(tasks.map((task) => [task.id, task])),
    [tasks],
  );

  function toggleAcceptance(taskId, index) {
    setProgress((current) => {
      const taskProgress = current[taskId] ?? { acceptance: {}, challenges: {} };

      return {
        ...current,
        [taskId]: {
          ...taskProgress,
          acceptance: {
            ...taskProgress.acceptance,
            [index]: !taskProgress.acceptance?.[index],
          },
        },
      };
    });
  }

  function toggleChallengeCriteria(taskId, challengeId, index) {
    setProgress((current) => {
      const taskProgress = current[taskId] ?? { acceptance: {}, challenges: {} };
      const challengeProgress = taskProgress.challenges?.[challengeId] ?? {};

      return {
        ...current,
        [taskId]: {
          ...taskProgress,
          challenges: {
            ...taskProgress.challenges,
            [challengeId]: {
              ...challengeProgress,
              [index]: !challengeProgress[index],
            },
          },
        },
      };
    });
  }

  function getAcceptanceState(taskId) {
    const task = tasksById[taskId];
    const taskProgress = getTaskProgress(task, progress);

    return {
      checkedItems: taskProgress.acceptance,
      isComplete: areAllItemsChecked(task.acceptanceCriteria, taskProgress.acceptance),
      toggle: (index) => toggleAcceptance(taskId, index),
    };
  }

  function getChallengeState(taskId, challenge, index) {
    const task = tasksById[taskId];
    const taskProgress = getTaskProgress(task, progress);
    const challengeId = getChallengeId(challenge, index);
    const checkedItems = taskProgress.challenges?.[challengeId] ?? {};
    const challengeOrderIndex = CHALLENGE_ORDER.indexOf(challenge.level);
    const acceptanceComplete = areAllItemsChecked(
      task.acceptanceCriteria,
      taskProgress.acceptance,
    );
    const previousChallenge = task.advancedChallenges?.[index - 1];
    const previousChallengeId = previousChallenge
      ? getChallengeId(previousChallenge, index - 1)
      : null;
    const previousComplete =
      index === 0 ||
      areAllItemsChecked(
        previousChallenge?.criteria,
        taskProgress.challenges?.[previousChallengeId] ?? {},
      );
    const followsKnownOrder =
      challengeOrderIndex === -1 || challengeOrderIndex === index;
    const isUnlocked = acceptanceComplete && previousComplete && followsKnownOrder;

    return {
      checkedItems,
      isComplete: areAllItemsChecked(challenge.criteria, checkedItems),
      isUnlocked,
      toggle: (criteriaIndex) =>
        toggleChallengeCriteria(taskId, challengeId, criteriaIndex),
    };
  }

  function getTaskFlowStates() {
    let dependencyChainComplete = true;

    const flowStates = tasks.map((task) => {
      const taskProgress = getTaskProgress(task, progress);
      const acceptanceState = {
        checkedItems: taskProgress.acceptance,
        isComplete: areAllItemsChecked(task.acceptanceCriteria, taskProgress.acceptance),
        toggle: (index) => toggleAcceptance(task.id, index),
      };
      const isUnlocked = dependencyChainComplete;

      dependencyChainComplete =
        dependencyChainComplete && acceptanceState.isComplete;

      return {
        task,
        acceptanceState,
        isComplete: acceptanceState.isComplete,
        isUnlocked,
      };
    });

    const currentProgressTask = flowStates.find(
      (taskState) => taskState.isUnlocked && !taskState.isComplete,
    );

    return flowStates.map((taskState) => ({
      ...taskState,
      isCurrentProgress: taskState.task.id === currentProgressTask?.task.id,
    }));
  }

  return {
    getAcceptanceState,
    getChallengeState,
    getTaskFlowStates,
  };
}
