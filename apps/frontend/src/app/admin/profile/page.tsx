'use client';

import {
  Card,
  CardContent,
  CardHeader,
  Badge,
  Button,
  Input,
} from '@/components/ui';
import { Mail, Shield, FileText, Phone, Edit2, X, Check } from 'lucide-react';
import { useAuthStore } from '@/store';
import { CustomPagination } from '@/components/design/pagination.design';
import { useState } from 'react';
import { MySessionList } from '@/libs';
import { UserSessionTable } from '@/components/table/user_session.table';
import UpdateAvatar from '@/components/pages/profile/update-avatar';
import { CustomImage } from '@/components/design';
import Link from 'next/link';

const ProfilePage = () => {
  const { userInfo, updateProfile } = useAuthStore();
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone_number: '',
  });

  const handleAvatarUpdateComplete = () => {
    setIsUpdateDialogOpen(false);
  };

  const handleEditClick = () => {
    // Populate form với data hiện tại
    const fullName = userInfo?.fullName || '';
    const [firstName = '', ...lastNameParts] = fullName.split(' ');
    const lastName = lastNameParts.join(' ');

    setFormData({
      firstName,
      lastName,
      email: userInfo?.email || '',
      phone_number: userInfo?.phone_number || '',
    });
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone_number: '',
    });
  };

  const handleSaveProfile = async () => {
    setIsUpdating(true);
    const success = await updateProfile(formData);
    setIsUpdating(false);

    if (success) {
      setIsEditing(false);
    }
  };

  const [currentPage, setCurrentPage] = useState(1);

  const handlePageChange = (page: number) => {
    if (page > 0 && page <= pagination.total_page) {
      setCurrentPage(page);
    }
  };

  const params = {
    page_size: 20,
  };

  const { session, isLoading, isError, pagination } = MySessionList(
    currentPage,
    params,
    0
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">User Profile</h1>
          <p className="text-sm text-gray-600 mt-1">
            Manage your account information and settings
          </p>
        </div>

        {/* Profile Card */}
        <Card className="border-gray-200 shadow-sm">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row gap-8">
              {/* Avatar Section */}
              <div className="flex flex-col items-center">
                <div className="relative">
                  {isUpdateDialogOpen && (
                    <UpdateAvatar onComplete={handleAvatarUpdateComplete} />
                  )}
                  {!isUpdateDialogOpen && (
                    <div className="relative h-40 w-40 rounded-full overflow-hidden border-4 border-blue-100 shadow-lg">
                      <CustomImage
                        src={userInfo?.avatarUrl || '/icons/logo.svg'}
                        alt={userInfo?.fullName || 'N/A'}
                        className="object-cover"
                        fill
                        unoptimized={true}
                      />
                    </div>
                  )}
                </div>
                <button
                  className="mt-4 text-blue-600 hover:text-blue-700 text-sm font-medium hover:underline"
                  onClick={() => setIsUpdateDialogOpen(!isUpdateDialogOpen)}
                >
                  Change Avatar
                </button>
              </div>

              {/* Info Section */}
              <div className="flex-1 space-y-6">
                {/* Name & Role */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-gray-200">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      {userInfo?.fullName}
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                      @{userInfo?.username}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-blue-50 text-blue-700 border-blue-200 px-3 py-1 w-fit">
                      <Shield className="w-3.5 h-3.5 mr-1.5" />
                      {userInfo?.role}
                    </Badge>
                    {!isEditing ? (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={handleEditClick}
                        className="flex items-center gap-2"
                      >
                        <Edit2 className="w-4 h-4" />
                        Edit Profile
                      </Button>
                    ) : (
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={handleSaveProfile}
                          disabled={isUpdating}
                          className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
                        >
                          <Check className="w-4 h-4" />
                          {isUpdating ? 'Saving...' : 'Save'}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={handleCancelEdit}
                          disabled={isUpdating}
                          className="flex items-center gap-2"
                        >
                          <X className="w-4 h-4" />
                          Cancel
                        </Button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Contact Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* First Name */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      First Name
                    </label>
                    {isEditing ? (
                      <Input
                        value={formData.firstName}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            firstName: e.target.value,
                          })
                        }
                        placeholder="Enter first name"
                        className="w-full"
                      />
                    ) : (
                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm text-gray-900 font-medium">
                          {userInfo?.fullName?.split(' ')[0] || 'N/A'}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Last Name */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      Last Name
                    </label>
                    {isEditing ? (
                      <Input
                        value={formData.lastName}
                        onChange={(e) =>
                          setFormData({ ...formData, lastName: e.target.value })
                        }
                        placeholder="Enter last name"
                        className="w-full"
                      />
                    ) : (
                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm text-gray-900 font-medium">
                          {userInfo?.fullName?.split(' ').slice(1).join(' ') ||
                            'N/A'}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      Email Address
                    </label>
                    {isEditing ? (
                      <Input
                        type="email"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        placeholder="Enter email"
                        className="w-full"
                      />
                    ) : (
                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <Mail className="w-5 h-5 text-blue-600" />
                        </div>
                        <span className="text-sm text-gray-900 font-medium">
                          {userInfo?.email}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Phone */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      Phone Number
                    </label>
                    {isEditing ? (
                      <Input
                        value={formData.phone_number}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            phone_number: e.target.value,
                          })
                        }
                        placeholder="Enter phone number"
                        className="w-full"
                      />
                    ) : (
                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <Phone className="w-5 h-5 text-blue-600" />
                        </div>
                        <span className="text-sm text-gray-900 font-medium">
                          {userInfo?.phone_number || 'N/A'}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sessions & Quick Access */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* User Sessions */}
          <div className="lg:col-span-2 space-y-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Active Sessions
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Manage your active login sessions
              </p>
            </div>

            <Card className="border-gray-200 shadow-sm">
              <UserSessionTable
                sessions={session}
                isLoading={isLoading}
                isError={isError}
              />
            </Card>

            {pagination.total_page > 1 && (
              <div className="flex justify-center">
                <CustomPagination
                  currentPage={currentPage}
                  totalPage={pagination.total_page}
                  onPageChange={handlePageChange}
                />
              </div>
            )}
          </div>

          {/* Quick Access */}
          <div className="lg:col-span-1 space-y-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Quick Access
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Shortcuts and actions
              </p>
            </div>

            <Card className="border-gray-200 shadow-sm">
              <CardContent className="p-4 space-y-3">
                <Link href="/report/create-report">
                  <Button className="w-full justify-start bg-blue-600 hover:bg-blue-700 text-white">
                    <FileText className="w-4 h-4 mr-2" />
                    Create Report
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
