import {
  Badge,
  Button,
  Card,
  CardBody,
  ListGroup,
  ListGroupItem,
  Progress,
} from "reactstrap";
import { Icon } from "./dashboard-icon";

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

export function InsightsPanel() {
  return (
    <aside className="space-y-6">
      <Card className="rounded-2xl border-0 bg-[#28205c] shadow-lg shadow-indigo-100">
        <CardBody className="p-6">
          <div className="mb-6 flex items-start justify-between">
            <div>
              <p className="text-sm font-medium">Collection progress</p>
              <h2 className="mt-1 text-2xl font-bold">92% collected</h2>
            </div>
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-white/10">
              <Icon name="chart" />
            </div>
          </div>
          <Progress
            value={92}
            className="h-2.5 bg-white/15"
            barClassName="bg-[#a6f4d3]"
          />
          <div className="mt-3 flex justify-between text-xs">
            <span>KES 486,000 received</span>
            <span>KES 526,000 goal</span>
          </div>
          <Button
            color="link"
            className="mt-4 flex items-center gap-2 p-0 text-sm font-semibold text-decoration-none"
          >
            View collection report <Icon name="arrow" size={16} />
          </Button>
        </CardBody>
      </Card>
      <Card className="rounded-2xl border-slate-200 shadow-sm">
        <CardBody className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-bold">Tasks to review</h2>
              <p className="mt-1 text-xs text-slate-500">
                Keep your rentals moving.
              </p>
            </div>
            <Badge pill color="danger" className="px-2.5 py-1">
              4 open
            </Badge>
          </div>
          <hr />
          <ListGroup flush>
            {tasks.map((task) => (
              <ListGroupItem
                key={task.title}
                className="flex items-start gap-3 border-0 bg-transparent px-0 py-2"
              >
                <span
                  className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${task.dot}`}
                />
                <div>
                  <p className="text-sm font-semibold text-slate-700">
                    {task.title}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">{task.text}</p>
                </div>
              </ListGroupItem>
            ))}
          </ListGroup>
        </CardBody>
      </Card>
    </aside>
  );
}
