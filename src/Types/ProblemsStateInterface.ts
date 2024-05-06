import Problem from './ProblemInterface';

export default interface ProblemsState { problems: Problem[], status: 'idle' | 'loading' | 'succeeded' | 'failed', error: string | null | unknown }
