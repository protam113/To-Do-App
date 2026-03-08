import type React from 'react';
//UI components

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Skeleton,
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui';
import { UserTableProps, UserColumns } from '@/types';
import NoResultsFound from '../design/no_result.design';
import { Icons } from '../../assets/icons';
import {
  useDeleteUser,
  useDemoteManager,
  usePromoteManager,
} from '../../hooks/user/useUser';
import { UserAvatar } from '../design/avatar.design';
import { useSelectedUserContext } from '../../context/use-selected-user.context';

export const UserTable: React.FC<UserTableProps> = ({
  users,
  isLoading,
  isError,
}) => {
  const { userId: selectedUserIdFromContext, setUserId } =
    useSelectedUserContext();

  const { mutate: demoteUser } = useDemoteManager();
  const { mutate: promoteUser } = usePromoteManager();

  const { mutate: deleteUser } = useDeleteUser();

  const handleRowClick = (userId: string) => {
    setUserId(userId === selectedUserIdFromContext ? null : userId);
  };

  const handlePromoteClick = (userId: string) => {
    if (
      window.confirm('Are you sure you want to promote this user to Manager?')
    ) {
      promoteUser(userId);
    }
  };

  const handleDemoteClick = (userId: string) => {
    if (window.confirm('Are you sure you want to demote this user to Users?')) {
      demoteUser(userId);
    }
  };
  const handleDeleteUserClick = (userId: string) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      deleteUser(userId);
    }
  };

  return (
    <>
      <div className="border">
        <Table>
          <TableHeader className="bg-table-header text-gray-700 font-bold">
            <TableRow>
              {UserColumns.map((col) => (
                <TableHead key={col.key} className={col.className}>
                  {col.label}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody className="bg-row">
            {isError ? (
              <TableRow>
                <TableCell
                  colSpan={UserColumns.length + 1}
                  className="text-center"
                >
                  <NoResultsFound />
                </TableCell>
              </TableRow>
            ) : isLoading ? (
              Array.from({ length: 5 }).map((_, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Skeleton className="h-4 w-4 rounded" />
                  </TableCell>
                  {UserColumns.map((col) => (
                    <TableCell key={col.key} className={col.className}>
                      <Skeleton className="h-4 w-full" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : users && users.length > 0 ? (
              users.map((user) => (
                <TableRow
                  key={user.id}
                  onClick={() => handleRowClick(user.id)}
                  className={`cursor-pointer hover:bg-gray-50 ${
                    selectedUserIdFromContext === user.id ? 'bg-blue-50' : ''
                  }`}
                >
                  {UserColumns.map((col) => {
                    let cellContent: React.ReactNode = '';

                    if (col.key === 'name') {
                      cellContent = user.username ? (
                        <div className="flex items-center space-x-3">
                          <UserAvatar
                            key={user.id}
                            url={user.avatarUrl || '/imgs/logo_c.jpg'}
                            username={user.username}
                          />
                          <div className="flex flex-col">
                            {user.firstName && (
                              <span className="font-bold">
                                {user.firstName} {user.lastName}
                              </span>
                            )}
                            {user.username && (
                              <span className="text-gray-400">
                                @{user.username}
                              </span>
                            )}
                          </div>
                        </div>
                      ) : (
                        ''
                      );
                    } else if (col.key === 'email') {
                      cellContent = user.email;
                    } else if (col.key === 'role') {
                      cellContent = user.role;
                    } else if (col.key === 'action') {
                      // Don't show actions for Admin users
                      if (user.role === 'admin') {
                        cellContent = null;
                      } else {
                        cellContent = (
                          <div className="flex space-x-2">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="flex items-center gap-1 text-sm hover:text-gray-400"
                                >
                                  <Icons.EllipsisVertical className="w-4 h-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent
                                align="end"
                                className="w-48 bg-white"
                              >
                                {user.role === 'user' ? (
                                  <DropdownMenuItem
                                    onClick={() => handlePromoteClick(user.id)}
                                  >
                                    <Icons.UserPlus className="w-4 h-4 mr-2" />
                                    Promote to Manager
                                  </DropdownMenuItem>
                                ) : user.role === 'manager' ? (
                                  <DropdownMenuItem
                                    onClick={() => handleDemoteClick(user.id)}
                                  >
                                    <Icons.UserPlus className="w-4 h-4 mr-2" />
                                    Demote to User
                                  </DropdownMenuItem>
                                ) : null}

                                <DropdownMenuItem
                                  variant="destructive"
                                  onClick={() => handleDeleteUserClick(user.id)}
                                >
                                  <Icons.Trash className="w-4 h-4 mr-2" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        );
                      }
                    }

                    return (
                      <TableCell key={col.key} className={col.className}>
                        {cellContent}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={UserColumns.length + 1}
                  className="text-center text-gray-500"
                >
                  <NoResultsFound />
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </>
  );
};
