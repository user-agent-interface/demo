export const Shipments = ({
  displayType,
  filter,
}: {
  displayType: 'map' | 'list';
  filter: 'inTransit' | 'delayed' | 'delivered';
}) => {
  return (
    <div>
      Shipments | displayType: {displayType} | filter: {filter}
    </div>
  );
};
