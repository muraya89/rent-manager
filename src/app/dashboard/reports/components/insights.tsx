import {
  Card,
  CardBody,
  ListGroup,
  ListGroupItem,
} from "reactstrap";
import type { CollectionProgress } from "@/app/Types/dashboard";
import BadgeComponent from "@/app/shared-components/badge"

const tasks = [
  {
    title: "Send payment reminders",
    text: "4 tenants have not paid",
    dot: "bg-rose-500",
  },
  {
    title: "Lease renewal due",
    text: "Caroline Njeri · 3 days",
    dot: "bg-amber-400",
  },
  {
    title: "Maintenance request",
    text: "Unit 4A · Maple Heights",
    dot: "bg-sky-500",
  },
];

export function InsightsPanel({
  collection,
}: {
  collection: CollectionProgress;
}) {
  const progress =
    collection.expected === 0
      ? 0
      : Math.min(100, (collection.collected / collection.expected) * 100);

  return (
    <aside className="space-y-6">
      {/* <Card className="rounded-2xl border-0 bg-[#28205c] shadow-lg shadow-indigo-100">
        <CardBody className="p-6">
          <div className="mb-6 flex items-start justify-between">
            <div>
              <p className="text-sm font-medium">Collection progress</p>
              <h2 className="mt-1 text-2xl font-bold">{progress.toFixed(1)}%</h2>
            </div>
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-white/10">
              <Icon name="chart" />
            </div>
          </div>
          <Progress
            value={progress}
            className="h-2.5"
            color="primary"
          />
          <div className="mt-3 flex justify-between text-xs">
            <span>{money(collection.collected)} received</span>
            <span>{money(collection.expected)} goal</span>
          </div>
          <Button
            color="link"
            className="mt-4 flex items-center gap-2 p-0 text-sm font-semibold text-decoration-none"
            href="/dashboard/reports#collection"
          >
            View collection report <Icon name="arrow" size={16} />
          </Button>
        </CardBody>
      </Card> */}

      <Card className="rounded-2xl border-0">
        <CardBody className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <span className="font-bold text-xl">Tasks to review</span>
            </div>
            <BadgeComponent
              pill
              textColor="text-primary"
              bgColor="bg-(--primary-light)"
              caption={`${tasks.length} open`}
            />
          </div>
          <hr />
          <ListGroup flush>
            {tasks.map((task) => (
              <ListGroupItem
                key={task.title}
                className="flex items-start gap-3 bg-transparent px-0"
              >
                <span
                  className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${task.dot}`}
                />
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-slate-700">
                    {task.title}
                  </span>
                  <span className="mt-1 text-xs text-slate-500">
                    {task.text}
                  </span>
                </div>
                {/* <hr className=""/> */}
              </ListGroupItem>
            ))}
          </ListGroup>
        </CardBody>
      </Card>
    </aside>
  );
}
