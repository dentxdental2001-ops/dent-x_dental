"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import AdminLayout from '@/components/AdminLayout';
import { useTeam } from '@/hooks/useApi';
import { Plus, Edit, Trash2, User, Clock, MoveUp, MoveDown } from 'lucide-react';
import type { TeamResponse } from '@/types/api';

export default function TeamPage() {
  const { team, pagination, loading, error, fetchTeam, deleteTeamMember, updateTeamMember } = useTeam();
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);

  useEffect(() => {
    fetchTeam();
  }, []);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete ${name} from the team?`)) {
      return;
    }

    setDeleteLoading(id);
    try {
      await deleteTeamMember(id);
    } catch (error) {
      console.error('Error deleting team member:', error);
      alert('Failed to delete team member. Please try again.');
    } finally {
      setDeleteLoading(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const calculateExperience = (startYear: number) => {
    const currentYear = new Date().getFullYear();
    const years = currentYear - startYear;
    return `${years} year${years !== 1 ? 's' : ''}`;
  };

  const handlePriorityChange = async (member: TeamResponse, direction: 'up' | 'down') => {
    const currentIndex = team.findIndex(t => t._id === member._id);
    if (currentIndex === -1) return;

    let newPriority: number;
    if (direction === 'up' && currentIndex > 0) {
      // Move up means lower priority number (closer to 1)
      newPriority = member.priority - 1;
    } else if (direction === 'down' && currentIndex < team.length - 1) {
      // Move down means higher priority number 
      newPriority = member.priority + 1;
    } else {
      return; // Can't move
    }

    try {
      // Update just this item's priority - the backend will handle shifting others
      await updateTeamMember(member._id, { priority: newPriority });
      
      // Refresh the list to show new ordering
      await fetchTeam();
    } catch (error) {
      console.error('Error updating priority:', error);
      alert('Failed to update priority. Please try again.');
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-[#0F2A3B]">Team Management</h1>
            <p className="text-[#5E6E7E] mt-2">
              Manage your dental clinic team members with priority ordering
            </p>
          </div>
          <Link
            href="/admin/team/new"
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#2FA4C5] text-white rounded-lg hover:bg-[#2389A7] transition-colors font-medium"
          >
            <Plus size={20} />
            Add Team Member
          </Link>
        </div>

        {/* Stats */}
        <div className="bg-white rounded-xl border border-[#E6EEF3] p-6">
          <h2 className="text-lg font-semibold text-[#0F2A3B] mb-4">Overview</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-[#F7FBFE] rounded-lg">
              <p className="text-2xl font-bold text-[#2FA4C5]">{pagination.total}</p>
              <p className="text-sm text-[#5E6E7E]">Total Team Members</p>
            </div>
            <div className="text-center p-4 bg-[#F7FBFE] rounded-lg">
              <p className="text-2xl font-bold text-[#2FA4C5]">
                {team.filter(member => member.role.toLowerCase().includes('doctor') || member.role.toLowerCase().includes('dentist')).length}
              </p>
              <p className="text-sm text-[#5E6E7E]">Doctors</p>
            </div>
            <div className="text-center p-4 bg-[#F7FBFE] rounded-lg">
              <p className="text-2xl font-bold text-[#2FA4C5]">
                {team.length > 0 
                  ? Math.round(team.reduce((sum, member) => sum + (new Date().getFullYear() - member.startYear), 0) / team.length)
                  : 0}
              </p>
              <p className="text-sm text-[#5E6E7E]">Avg. Experience (Years)</p>
            </div>
          </div>
        </div>

        {/* Team List */}
        <div className="bg-white rounded-xl border border-[#E6EEF3] overflow-hidden">
          <div className="px-6 py-4 border-b border-[#E6EEF3]">
            <h2 className="text-lg font-semibold text-[#0F2A3B]">Team Members</h2>
          </div>

          {loading ? (
            <div className="p-8 text-center">
              <div className="inline-flex items-center gap-2 text-[#5E6E7E]">
                <div className="w-5 h-5 border-2 border-[#2FA4C5]/30 border-t-[#2FA4C5] rounded-full animate-spin" />
                Loading team members...
              </div>
            </div>
          ) : error ? (
            <div className="p-8 text-center text-red-600">
              Error loading team members: {error}
            </div>
          ) : team.length === 0 ? (
            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-[#F7FBFE] rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="w-8 h-8 text-[#5E6E7E]" />
              </div>
              <h3 className="text-lg font-medium text-[#0F2A3B] mb-2">No team members yet</h3>
              <p className="text-[#5E6E7E] mb-4">Start by adding your first team member</p>
              <Link
                href="/admin/team/new"
                className="inline-flex items-center gap-2 px-4 py-2 bg-[#2FA4C5] text-white rounded-lg hover:bg-[#2389A7] transition-colors"
              >
                <Plus size={16} />
                Add First Team Member
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-[#E6EEF3]">
              {team.map((member, index) => (
                <div key={member._id} className="p-6">
                  <div className="flex flex-col lg:flex-row gap-6">
                    {/* Profile Image */}
                    <div className="flex-shrink-0">
                      <div className="relative w-20 h-20 rounded-full overflow-hidden border-4 border-[#2FA4C5]/20">
                        <Image
                          src={member.image}
                          alt={member.name}
                          fill
                          className="object-cover"
                        />
                        <div className="absolute -top-2 -right-2 bg-[#2FA4C5] text-white px-2 py-1 rounded-full text-xs font-medium">
                          #{member.priority}
                        </div>
                      </div>
                    </div>

                    {/* Member Info */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-semibold text-[#0F2A3B] text-lg">{member.name}</h3>
                          <p className="text-[#2FA4C5] font-medium">{member.role}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          {/* Priority Controls */}
                          <div className="flex items-center gap-1 mr-2">
                            <button
                              onClick={() => handlePriorityChange(member, 'up')}
                              disabled={index === 0}
                              className="p-2 text-[#5E6E7E] hover:text-[#2FA4C5] hover:bg-[#F7FBFE] rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                              title="Move up"
                            >
                              <MoveUp size={18} />
                            </button>
                            <button
                              onClick={() => handlePriorityChange(member, 'down')}
                              disabled={index === team.length - 1}
                              className="p-2 text-[#5E6E7E] hover:text-[#2FA4C5] hover:bg-[#F7FBFE] rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                              title="Move down"
                            >
                              <MoveDown size={18} />
                            </button>
                          </div>

                          {/* Edit/Delete */}
                          <Link
                            href={`/admin/team/${member._id}/edit`}
                            className="p-2 text-[#5E6E7E] hover:text-[#2FA4C5] hover:bg-[#F7FBFE] rounded-lg transition-colors"
                            title="Edit team member"
                          >
                            <Edit size={18} />
                          </Link>
                          <button
                            onClick={() => handleDelete(member._id, member.name)}
                            disabled={deleteLoading === member._id}
                            className="p-2 text-[#5E6E7E] hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                            title="Delete team member"
                          >
                            {deleteLoading === member._id ? (
                              <div className="w-[18px] h-[18px] border-2 border-red-300 border-t-red-600 rounded-full animate-spin" />
                            ) : (
                              <Trash2 size={18} />
                            )}
                          </button>
                        </div>
                      </div>

                      {/* Details */}
                      <div className="flex items-center gap-2 text-sm text-[#5E6E7E] mb-4">
                        <Clock className="w-4 h-4" />
                        <span>Experience: {calculateExperience(member.startYear)}</span>
                      </div>

                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}