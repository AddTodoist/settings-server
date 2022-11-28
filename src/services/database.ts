import UserInfo from './mongoose-conection';

/**
 * Finds a user by twitter id *(not hashed)*
 */
export const findUserByTodoistId = async (todoistId: string) => {
  const user = await UserInfo.findOne({ todoistId });
  return user;
};
