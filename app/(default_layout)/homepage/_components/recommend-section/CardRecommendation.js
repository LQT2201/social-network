"use client";
import RecommendationCardItem from "./RecommendationCardItem";



const recommendations = [
  {
    _id: "1",
    avatar: "https://github.com/shadcn.png",
    avatarFallback: "QT",
    username: "sempupy23",
    description: "Have a nice days sdf asdf asf asdfas sdf",
  },
  {
    _id: "2",
    avatar: "https://github.com/shadcn.png",
    avatarFallback: "QT",
    username: "user2",
    description: "Description for user2",
  },
  {
    _id: "3",
    avatar: "https://github.com/shadcn.png",
    avatarFallback: "QT",
    username: "user3",
    description: "Description for user3",
  },
];

const CardRecommendation = () => {
  return (
    <>
      {recommendations.map((rec) => (
        <RecommendationCardItem key={rec._id} recommendation={rec} />
      ))}
    </>
  );
};

export default CardRecommendation;
