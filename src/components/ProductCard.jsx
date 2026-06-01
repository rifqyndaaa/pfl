import Card from "./Card";

export default function ProductCard({
  image,
  title,
  category,
  price,
  description,
}) {
  return (
    <Card>
      <img
        src={image}
        alt={title}
        className="w-full h-52 object-cover rounded-lg"
      />

      <div className="mt-4">
        <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm">
          {category}
        </span>

        <h2 className="font-bold text-xl mt-3">
          {title}
        </h2>

        <p className="text-gray-600 mt-2">
          {description}
        </p>

        <div className="flex justify-between items-center mt-4">
          <h3 className="font-bold text-blue-600">
            {price}
          </h3>

          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg">
            Detail
          </button>
        </div>
      </div>
    </Card>
  );
}