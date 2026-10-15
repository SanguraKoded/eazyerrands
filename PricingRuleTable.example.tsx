import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';

type Rule = { key: string; value: number };
const api = (p: string, init?: RequestInit) => fetch(`/v1/admin${p}`, { ...init, headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.token}` } }).then(r => r.json());

export function PricingRuleTable() {
  const qc = useQueryClient();
  const { data = [] } = useQuery<Rule[]>({ queryKey: ['rules'], queryFn: () => api('/pricing-rules') });
  const save = useMutation({
    mutationFn: (r: Rule) => api('/pricing-rules', { method: 'PUT', body: JSON.stringify(r) }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['rules'] }),
  });
  const [draft, setDraft] = useState<Record<string, string>>({});
  return (
    <table>
      <thead><tr><th>Rule</th><th>Value</th><th /></tr></thead>
      <tbody>
        {data.map(r => (
          <tr key={r.key}>
            <td>{r.key}</td>
            <td><input value={draft[r.key] ?? r.value} onChange={e => setDraft({ ...draft, [r.key]: e.target.value })} /></td>
            <td><button disabled={draft[r.key] === undefined} onClick={() => save.mutate({ key: r.key, value: Number(draft[r.key]) })}>Save</button></td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
