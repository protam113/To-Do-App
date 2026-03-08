'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  createTeamFormSchema,
  addTeamOwnerFormSchema,
  addTeamMemberFormSchema,
  createProjectFormSchema,
} from '@/types';
import { Button } from '@/components/ui';
import { Arrows } from '@/assets/icons';
import StepIndicator from '@/components/design/step.design';
import CreateTeamDetail from '@/components/steps/team/create-team';
import AddOwnerDetail from '@/components/steps/team/add-owner';
import AddMembersDetail from '@/components/steps/team/add-members';
import CreateProjectDetail from '@/components/steps/team/add-project';
import {
  useAddTeamMembers,
  useAddTeamOwner,
  useCreateTeam,
  useActivateTeam,
} from '@/hooks/team/useTeam';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import z from 'zod';
import { useCreateProject } from '@/hooks/project/useProject';
import { useRouter } from 'next/navigation';
import { Container } from '@/components';

const STEPS = [
  { id: 1, name: 'Create Team' },
  { id: 2, name: 'Add Team Owner' },
  { id: 3, name: 'Add Team Member' },
  { id: 4, name: 'Add Project' },
];

export default function CreateTeamPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [teamId, setTeamId] = useState<string>('');

  // Create team
  const { mutate: createTeam, isPending: isCreatingTeam } = useCreateTeam();
  // Add owner
  const { mutate: addOwner, isPending: isAddingOwner } =
    useAddTeamOwner(teamId);
  // Add members
  const { mutate: addMembers, isPending: isAddingMembers } =
    useAddTeamMembers(teamId);
  // Create Project
  const { mutate: createProject, isPending: isCreatingProject } =
    useCreateProject();
  // Activate team
  const { mutate: activateTeam, isPending: isActivatingTeam } =
    useActivateTeam(teamId);

  // Form for step 1
  const formStep1 = useForm<z.infer<typeof createTeamFormSchema>>({
    resolver: zodResolver(createTeamFormSchema),
    defaultValues: {
      name: '',
      description: '',
    },
  });

  // Form for step 2 (optional)
  const formStep2 = useForm<z.infer<typeof addTeamOwnerFormSchema>>({
    resolver: zodResolver(addTeamOwnerFormSchema),
    defaultValues: {
      ownerId: '',
    },
    mode: 'onChange',
  });

  // Form for step 3 (optional)
  const formStep3 = useForm<z.infer<typeof addTeamMemberFormSchema>>({
    resolver: zodResolver(addTeamMemberFormSchema),
    defaultValues: {
      members: [],
    },
    mode: 'onChange',
  });

  // Form for step 4 (optional)
  const formStep4 = useForm<z.infer<typeof createProjectFormSchema>>({
    resolver: zodResolver(createProjectFormSchema),
    defaultValues: {
      name: '',
      description: '',
      teamId: teamId,
    },
    mode: 'onChange',
  });

  const handleNext = () => {
    if (currentStep === 1) {
      formStep1.handleSubmit(onSubmitStep1)();
    } else if (currentStep === 2) {
      formStep2.handleSubmit(onSubmitStep2)();
    } else if (currentStep === 3) {
      formStep3.handleSubmit(onSubmitStep3)();
    } else if (currentStep === 4) {
      formStep4.handleSubmit(onSubmitStep4)();
    }
  };

  const handleSkip = () => {
    if (currentStep === 2) {
      // Skip add owner
      toast.info('Skipped adding owner');
      setCurrentStep(3);
    } else if (currentStep === 3) {
      // Skip add members
      toast.info('Skipped adding members');
      formStep4.setValue('teamId', teamId);
      setCurrentStep(4);
    } else if (currentStep === 4) {
      // Skip create project, just activate team
      toast.info('Skipped creating project');
      activateTeam(undefined, {
        onSuccess: () => {
          toast.success('Team activated successfully!');
          router.push('/admin/team');
        },
        onError: (error: Error) => {
          toast.error(error.message || 'Failed to activate team');
        },
      });
    }
  };

  const onSubmitStep1 = (data: z.infer<typeof createTeamFormSchema>) => {
    createTeam(data, {
      onSuccess: (response: any) => {
        const createdTeamId = response.data.result._id;
        setTeamId(createdTeamId);
        toast.success('Team created successfully!');
        setCurrentStep(2);
      },
      onError: (error: Error) => {
        toast.error(error.message || 'Failed to create team');
      },
    });
  };

  const onSubmitStep2 = (data: z.infer<typeof addTeamOwnerFormSchema>) => {
    addOwner(data, {
      onSuccess: () => {
        toast.success('Owner added successfully!');
        setCurrentStep(3);
      },
      onError: (error: Error) => {
        toast.error(error.message || 'Failed to add owner');
      },
    });
  };

  const onSubmitStep3 = (data: z.infer<typeof addTeamMemberFormSchema>) => {
    addMembers(data, {
      onSuccess: () => {
        toast.success('Members added successfully!');
        // Set teamId for step 4 form
        formStep4.setValue('teamId', teamId);
        setCurrentStep(4);
      },
      onError: (error: Error) => {
        toast.error(error.message || 'Failed to add members');
      },
    });
  };

  const onSubmitStep4 = (data: z.infer<typeof createProjectFormSchema>) => {
    // Create project first
    createProject(data, {
      onSuccess: () => {
        // Then activate team
        activateTeam(undefined, {
          onSuccess: () => {
            toast.success('Team setup completed successfully!');
            // Redirect to team list
            router.push('/admin/team');
          },
          onError: (error: Error) => {
            toast.error(error.message || 'Failed to activate team');
          },
        });
      },
      onError: (error: Error) => {
        toast.error(error.message || 'Failed to create project');
      },
    });
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <CreateTeamDetail
            register={formStep1.register}
            errors={formStep1.formState.errors}
          />
        );
      case 2:
        return (
          <AddOwnerDetail
            register={formStep2.register}
            errors={formStep2.formState.errors}
            setValue={formStep2.setValue}
            selectedOwnerId={formStep2.watch('ownerId')}
          />
        );
      case 3:
        return (
          <AddMembersDetail
            setValue={formStep3.setValue}
            watch={formStep3.watch}
            error={formStep3.formState.errors.members?.message}
          />
        );
      case 4:
        return (
          <CreateProjectDetail
            register={formStep4.register}
            errors={formStep4.formState.errors}
            teamId={teamId}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Container className="min-h-screen  p-8">
      <div className="mx-auto p-2">
        <div className="mb-8 flex items-center justify-between">
          <button
            onClick={handlePrevious}
            disabled={currentStep === 1}
            className="flex items-center gap-2 text-sm text-main hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Arrows.ArrowLeft className="h-4 w-4" />
            Go Back
          </button>
        </div>

        <div className="items-center justify-center">
          <StepIndicator steps={STEPS} currentStep={currentStep} />
        </div>

        <div className="mt-12 ">{renderStep()}</div>

        <div className="mt-12 flex items-center justify-between">
          <button
            onClick={handlePrevious}
            disabled={currentStep === 1}
            className="flex items-center gap-2 text-sm text-main hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Arrows.ArrowLeft className="h-4 w-4" />
            Go Back
          </button>

          <div className="flex items-center  gap-4">
            {/* Skip button - only show for steps 2, 3, 4 */}
            {currentStep > 1 && (
              <Button
                onClick={handleSkip}
                disabled={
                  isCreatingTeam ||
                  isAddingOwner ||
                  isAddingMembers ||
                  isCreatingProject ||
                  isActivatingTeam
                }
                variant="outline"
                className="gap-2 h-[54px]   w-[150px]"
              >
                Skip
              </Button>
            )}

            {/* Next/Complete button */}
            <Button
              onClick={handleNext}
              disabled={
                isCreatingTeam ||
                isAddingOwner ||
                isAddingMembers ||
                isCreatingProject ||
                isActivatingTeam
              }
              className="gap-2 bg-main h-[54px]   w-[200px]"
            >
              {isCreatingTeam ||
              isAddingOwner ||
              isAddingMembers ||
              isCreatingProject ||
              isActivatingTeam
                ? 'Loading...'
                : currentStep === STEPS.length
                ? 'Complete Setup'
                : 'Next'}
            </Button>
          </div>
        </div>
      </div>
    </Container>
  );
}
