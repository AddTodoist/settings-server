import { ColumnSet, TextInput, Column, SubmitAction } from '@doist/ui-extensions-core';

const LabelsCard = ({ tweetLabel, threadLabel }: { tweetLabel?: string, threadLabel?: string} = {}) => {
  const labelsCol = new ColumnSet();

  const tweetLabelCol = new Column();
  const threadLabelCol = new Column();

  tweetLabelCol.addItem(TextInput.from({ id: 'tweet-label', label: 'Tweet Label', separator: true, inputStyle: 'text', defaultValue: tweetLabel }));
  threadLabelCol.addItem(TextInput.from({ id: 'thread-label', label: 'Thread Label', separator: true, inputStyle: 'text', defaultValue: threadLabel }));

  labelsCol.addColumn(tweetLabelCol);
  labelsCol.addColumn(threadLabelCol);

  return labelsCol;
};

const SubmitButton = () => SubmitAction.from({ title: 'Submit', style: 'positive', loadingText: 'Saving...' });

export { LabelsCard, SubmitButton };
