import { Rabbit } from "lucide-react";
const NoMoreRecommendations = ({ title }) => (
  <div className="flex items-center justify-center p-4 text-center bg-baby-powder rounded-lg shadow animate-fadeIn mb-2">
    <Rabbit className="w-6 h-6 mr-2 text-yellow-orange animate-bounce" />
    <p className="text-sm font-medium text-yellow-orange animate-pulse">
      {title}
    </p>
    <Rabbit className="w-6 h-6 ml-2 text-yellow-orange animate-bounce" />
  </div>
);

<style jsx>{`
  .animate-fadeIn {
    animation: fadeIn 1s ease-in-out;
  }

  .animate-bounce {
    animation: bounce 1s infinite;
  }

  .animate-pulse {
    animation: pulse 2s infinite;
  }

  @keyframes fadeIn {
    0% {
      opacity: 0;
      transform: translateY(10px);
    }
    100% {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes bounce {
    0%,
    20%,
    50%,
    80%,
    100% {
      transform: translateY(0);
    }
    40% {
      transform: translateY(-10px);
    }
    60% {
      transform: translateY(-5px);
    }
  }

  @keyframes pulse {
    0% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
    100% {
      opacity: 1;
    }
  }
`}</style>;

export default NoMoreRecommendations;
