import { ColumnSet, TextInput, Column, SubmitAction, ToggleInput, DoistCard } from '@doist/ui-extensions-core';

const ResponseOnSave = ({ noResponse }: { noResponse: true | undefined }) => ToggleInput.from({ id: 'noResponse', label: 'Disable response when a tweet is saved', defaultValue: noResponse ? 'true' : 'false' });

const LabelsCard = ({ tweetLabel, threadLabel }: { tweetLabel?: string | null, threadLabel?: string | null } = {}) => {
  const twLabel = tweetLabel === null ? undefined : tweetLabel === undefined ? '🐦Tweet' : tweetLabel;
  const thLabel = threadLabel === null ? undefined : threadLabel === undefined ? '🧵Thread' : threadLabel;

  const labelsCol = new ColumnSet();

  const tweetLabelCol = new Column();
  const threadLabelCol = new Column();

  tweetLabelCol.addItem(TextInput.from({ id: 'tweetLabel', label: 'Tweet Label', separator: true, inputStyle: 'text', defaultValue: twLabel }));
  threadLabelCol.addItem(TextInput.from({ id: 'threadLabel', label: 'Thread Label', separator: true, inputStyle: 'text', defaultValue: thLabel }));

  labelsCol.addColumn(tweetLabelCol);
  labelsCol.addColumn(threadLabelCol);

  return labelsCol;
};

const SubmitButton = () => SubmitAction.from({ title: 'Submit', style: 'positive', loadingText: 'Saving...' });

function generateResponseCard({ threadLabel, noResponse, tweetLabel }: Pick<IUserInfo, 'threadLabel' | 'noResponse' | 'tweetLabel'>): DoistCard {
  const card = new DoistCard();
  card.addItem(LabelsCard({ threadLabel, tweetLabel }));
  card.addItem(ResponseOnSave({noResponse}));
  card.addAction(SubmitButton());
  return card;
}

export { LabelsCard, SubmitButton, ResponseOnSave, generateResponseCard };
