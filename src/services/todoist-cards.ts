import { ColumnSet, TextBlock, TextInput, Column, SubmitAction, ToggleInput, DoistCard } from '@doist/ui-extensions-core';

const ResponseOnSave = ({ noResponse }: { noResponse: true | undefined }) => ToggleInput.from({ id: 'noResponse', label: 'Disable response on save', defaultValue: noResponse ? 'true' : 'false' });

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

const SubmitButton = () => SubmitAction.from({ title: 'Submit', style: 'positive', loadingText: 'Saving...', data: { comesFromSettingsPage: true } });

function generateResponseCard({ threadLabel, noResponse, tweetLabel }: Pick<IUserInfo, 'threadLabel' | 'noResponse' | 'tweetLabel'>): DoistCard {
  const card = new DoistCard();
  // title
  card.addItem(TextBlock.from({ text: 'Customize the bot behavior', style: 'heading', weight: 'bolder', size: 'extraLarge' }));

  // labels section
  card.addItem(TextBlock.from({ text: 'Labels' , style: 'heading', weight: 'bolder', size: 'large' }));
  card.addItem(TextBlock.from({ text: 'The bot will add these labels to the saved tweets and threads' }));
  card.addItem(LabelsCard({ threadLabel, tweetLabel }));
  card.addItem(TextBlock.from({ text: '⚠️ Note: Left empty to disable the label', size: 'small', spacing: 'large' }));

  // No response section
  card.addItem(ResponseOnSave({ noResponse }));

  // submit button
  card.addAction(SubmitButton());
  return card;
}

function generateNoTokenResponseCard(): DoistCard {
  const card = new DoistCard();
  card.addItem(TextBlock.from({ text: 'Something went wrong 😟', style: 'heading', weight: 'bolder', size: 'extraLarge' }));
  card.addItem(TextBlock.from({ text: 'It seems like we don\'t have your Todoist info yet.', size: 'large' }));
  card.addItem(TextBlock.from({ text: 'Please send "/init" to the bot to start your configuration', size: 'large' }));
  card.addItem(TextBlock.from({ text: '[@AddTodoist Twitter Bot](https://twitter.com/AddTodoist)', spacing: 'large' }));
  card.addItem(TextBlock.from({ text: 'Need help? See how to [set up the bot](https://addtodoist.vercel.app/#setup)', size: 'large', spacing: 'large' }));

  card.addItem(TextBlock.from({ text: '⚠️ Note: We have migrated the DB but some recent accounts might experience this issue. Just follow the instructions avobe.', size: 'small', spacing: 'large' }));

  card.addAction(SubmitAction.from({ title: 'Retry', style: 'default', loadingText: 'Retrying...' }));
  return card;
}

export { LabelsCard, SubmitButton, ResponseOnSave, generateResponseCard, generateNoTokenResponseCard };
