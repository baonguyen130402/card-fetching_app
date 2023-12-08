import { useLocation, useParams, useNavigate } from "react-router-dom";

import { Card } from "./Card";

export const ProductCard = () => {
  const navigate = useNavigate()
  const location = useLocation();
  const params = useParams()

  const product = location.state[params.id];

  return (
    <div className="justify-center items-center flex flex-col overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
      <div className="bg-transparent rounded-lg flex flex-col justify-center items-center">
        {
          <Card
            name={product.title}
            image={product.thumbnail}
          />
        }
        <button onClick={() => navigate(-1)}>Back</button>
      </div>
    </div>
  );
};
