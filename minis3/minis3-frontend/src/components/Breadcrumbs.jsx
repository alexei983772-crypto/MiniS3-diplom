export default function Breadcrumbs({ path, setPath }) {
  const parts = path ? path.split("/") : [];

  return (
    <div className="flex gap-2 text-sm mb-3">
      <span
        className="cursor-pointer text-blue-500"
        onClick={() => setPath("")}
      >
        root
      </span>

      {parts.map((p, i) => {
        const newPath = parts.slice(0, i + 1).join("/");

        return (
          <span
            key={i}
            className="cursor-pointer"
            onClick={() => setPath(newPath)}
          >
            / {p}
          </span>
        );
      })}
    </div>
  );
}