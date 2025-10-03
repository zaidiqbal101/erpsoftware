import { ArrowUpRight, ArrowDownRight } from "lucide-react";

export default function TransactionItem({ type, amount, description, time, status }) {
  const isIncoming = type === 'incoming';

  return (
    <div className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg">
      <div className="flex items-center space-x-3">
        <div className={`w-10 h-10 flex items-center justify-center rounded-full ${isIncoming ? "bg-green-100" : "bg-red-100"}`}>
          {isIncoming ? <ArrowDownRight className="w-5 h-5 text-green-600" /> : <ArrowUpRight className="w-5 h-5 text-red-600" />}
        </div>
        <div>
          <p className="font-medium text-gray-900">{description}</p>
          <p className="text-sm text-gray-500">{time}</p>
        </div>
      </div>
      <div className="text-right">
        <p className={`font-semibold ${isIncoming ? "text-green-600" : "text-red-600"}`}>
          {isIncoming ? "+" : "-"}${amount}
        </p>
        <span className={`text-xs px-2 py-1 rounded-full ${
          status === "completed" ? "bg-green-100 text-green-800" :
          status === "pending" ? "bg-yellow-100 text-yellow-800" : "bg-gray-100 text-gray-800"
        }`}>
          {status}
        </span>
      </div>
    </div>
  );
}
