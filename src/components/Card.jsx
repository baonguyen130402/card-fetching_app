export const Card = (props) => {
  const { name, image } = props;

  return (
    <>
      <a
        href="#"
        className="flex flex-col max-w-sm p-2 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
      >
        <img
          className="w-32 mb-2 bg-transparent rounded-lg align-center mx-auto"
          src={image}
        />
        <p className="font-normal text-gray-700 dark:text-gray-400">
          {name}
        </p>
      </a>
    </>
  );
};
