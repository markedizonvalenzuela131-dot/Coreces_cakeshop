import { useParams } from 'react-router-dom';
import { Card, Badge } from '@/components/ui';

export function OrderDetail() {
  const { id } = useParams();

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-caption text-text-muted uppercase tracking-wider">Order</p>
            <h1 className="text-display-md font-display font-medium text-charcoal-900">#{id}</h1>
          </div>
          <Badge variant="primary">In Review</Badge>
        </div>
      </Card>
    </div>
  );
}
