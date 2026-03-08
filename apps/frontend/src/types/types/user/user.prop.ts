import { UserListData } from '../../responses/user/list.reponse.js';

export interface UserTableProps {
  users: UserListData[];
  isLoading: boolean;
  isError: boolean;
}
