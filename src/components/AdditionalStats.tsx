import { Tv, Clock, Users, ArrowUpRight } from 'lucide-react';

export const AdditionalStats: React.FC = () => {
  return (
    <div className="space-y-16 mt-16">
      
      {/* Green Banner: Live-class attendance is 3x more consistent and gets classes finished. */}
      <div className="bg-[#E7F6EC] border border-[#CDEEDB] rounded-[24px] p-6 text-center shadow-sm">
        <p className="text-[20px] font-bold text-[#1E5631] flex items-center justify-center gap-2">
          <span className="text-2xl">📈</span>
          Live-class attendance is 3x more consistent and gets classes finished. Join upcoming batches today!
        </p>
      </div>

      {/* 3 Columns/Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Card 1 */}
        <div className="bg-white border border-card-border rounded-[24px] p-8 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-bl-full -z-10 group-hover:scale-110 transition-transform"></div>
          <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-primary-blue mb-6">
            <Tv className="w-6 h-6" />
          </div>
          <h3 className="text-[22px] font-bold text-text-primary font-heading">
            Live Learning
          </h3>
          <p className="text-text-secondary text-sm font-medium mt-3 leading-relaxed">
            Attend live interactive webinars hosted by senior software professionals. Learn concepts step-by-step.
          </p>
        </div>

        {/* Card 2 */}
        <div className="bg-white border border-card-border rounded-[24px] p-8 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-bl-full -z-10 group-hover:scale-110 transition-transform"></div>
          <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 mb-6">
            <Users className="w-6 h-6" />
          </div>
          <h3 className="text-[22px] font-bold text-text-primary font-heading">
            Clear Doubts Instantly
          </h3>
          <p className="text-text-secondary text-sm font-medium mt-3 leading-relaxed">
            Don't get stuck! Ask doubts live during classes and get immediate one-on-one help from dedicated teaching assistants.
          </p>
        </div>

        {/* Card 3 */}
        <div className="bg-white border border-card-border rounded-[24px] p-8 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-bl-full -z-10 group-hover:scale-110 transition-transform"></div>
          <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600 mb-6">
            <Clock className="w-6 h-6" />
          </div>
          <h3 className="text-[22px] font-bold text-text-primary font-heading">
            Flexible Batches
          </h3>
          <p className="text-text-secondary text-sm font-medium mt-3 leading-relaxed">
            Switch between morning and evening batches to fit your busy college or work schedule. Learn at your convenience.
          </p>
        </div>
      </div>

      {/* Headline: Get One Step Ahead of 90% of Your Peers */}
      <div className="text-center max-w-2xl mx-auto space-y-4">
        <h2 className="text-[36px] font-extrabold text-text-primary font-heading leading-tight tracking-tight">
          Get One Step Ahead of 90% of Your Peers
        </h2>
        <p className="text-text-secondary text-base font-medium leading-relaxed">
          The average live class completion rate is 3x higher compared to pre-recorded courses. By showing up, you increase your chances of placement success by 90%.
        </p>
        <div className="pt-2">
          <button className="inline-flex items-center gap-2 bg-[#E9EDFF] hover:bg-[#D7E0F3] text-primary-blue font-bold px-6 py-3 rounded-full text-sm transition-colors group">
            <span>Explore Learning Paths</span>
            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </button>
        </div>
      </div>

    </div>
  );
};
