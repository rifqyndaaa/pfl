export default function TimelineItem({
  title,
  time,
}) {
  return (
    <div className="flex gap-3 mb-4">
      <div className="w-3 h-3 bg-blue-500 rounded-full mt-2" />

      <div>
        <p className="font-semibold">
          {title}
        </p>

        <p className="text-sm text-gray-500">
          {time}
        </p>
      </div>
    </div>
  );
}