import { LoadingSpin } from '@/components/loading/spin';

const BacklogSkeleton = () => {
  return (
    <div className="flex animate-pulse min-h-screen flex-col gap-y-4">
      <LoadingSpin />
    </div>
  );
};

export default BacklogSkeleton;
