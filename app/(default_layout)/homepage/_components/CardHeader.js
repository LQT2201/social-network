const { Ellipsis } = require("lucide-react");

const CardHeader = () => (
  <div className="flex flex-row justify-between py-3 px-5">
    <p className="text-jet">michilin.boy</p>
    <div className="flex text-d-gray gap-2 items-center">
      <p>6 days ago</p>
      <Ellipsis className="cursor-pointer hover:text-l-yellow" />
    </div>
  </div>
);

export default CardHeader;
