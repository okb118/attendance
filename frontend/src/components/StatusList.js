import React from "react";

function StatusList({ statusList }) {
  return (
    <div>
      <h3>出退勤ステータス</h3>
      {statusList.length === 0 ? (
        <p>現在表示できる情報がありません。</p>
      ) : (
        <ul>
          {statusList.map((status, i) => (
            <li key={i}>
              {status.username}: {status.status}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default StatusList;