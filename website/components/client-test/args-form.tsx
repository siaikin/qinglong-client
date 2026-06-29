'use client';

import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import { Accordion, Accordions } from 'fumadocs-ui/components/accordion';

const INPUT =
  'border-fd-border bg-fd-background w-full rounded-lg border px-3 py-2 text-sm';
const TEXTAREA =
  'border-fd-border bg-fd-secondary w-full rounded-lg border px-3 py-2 font-mono text-sm';

const FIELD_LABELS: Record<string, string> = {
  searchValue: '搜索关键词',
  page: '页码',
  size: '每页条数',
  id: 'ID',
  ids: 'ID 列表',
  name: '名称',
  value: '值',
  remarks: '备注',
  labels: '标签',
  command: '命令',
  schedule: '定时规则',
  log_path: '日志路径',
  fromIndex: '起始索引',
  toIndex: '目标索引',
  isDisabled: '是否禁用',
  type: '类型',
  sub_id: '订阅 ID',
  url: 'URL',
  branch: '分支',
  pullCount: '拉取次数',
  isDisabled2: '是否禁用',
  filename: '文件名',
  path: '路径',
  content: '内容',
  title: '标题',
  message: '消息',
  level: '级别',
  status: '状态',
};

function labelFor(key: string): string {
  return FIELD_LABELS[key] ?? key;
}

function isPlainObject(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null && !Array.isArray(v);
}

function isNumberArray(arr: unknown[]): boolean {
  return arr.every((x) => typeof x === 'number');
}

function isStringArray(arr: unknown[]): boolean {
  return arr.every((x) => typeof x === 'string');
}

function parseCommaNumbers(raw: string): number[] {
  return raw
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
    .map(Number);
}

function parseCommaStrings(raw: string): string[] {
  return raw
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
}

function canRenderValue(value: unknown, depth = 0): boolean {
  if (depth > 4) return false;
  if (
    value === null ||
    typeof value === 'string' ||
    typeof value === 'number' ||
    typeof value === 'boolean'
  ) {
    return true;
  }
  if (Array.isArray(value)) {
    if (value.length === 0) return true;
    if (isNumberArray(value) || isStringArray(value)) return true;
    if (value.length === 1 && Array.isArray(value[0])) {
      const inner = value[0] as unknown[];
      return inner.length === 0 || isNumberArray(inner);
    }
    if (value.every(isPlainObject)) {
      return value.every((item) =>
        Object.values(item).every((v) => canRenderValue(v, depth + 1)),
      );
    }
    return false;
  }
  if (isPlainObject(value)) {
    return Object.values(value).every((v) => canRenderValue(v, depth + 1));
  }
  return false;
}

function Field({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label className="mb-1 block text-sm">{label}</label>
      {children}
    </div>
  );
}

function ObjectEditor({
  value,
  onChange,
}: {
  value: Record<string, unknown>;
  onChange: (v: Record<string, unknown>) => void;
}) {
  return (
    <div className="space-y-3">
      {Object.entries(value).map(([key, val]) => (
        <ArgEditor
          key={key}
          label={labelFor(key)}
          value={val}
          onChange={(newVal) => onChange({ ...value, [key]: newVal })}
        />
      ))}
    </div>
  );
}

function ArgEditor({
  value,
  onChange,
  label,
}: {
  value: unknown;
  onChange: (v: unknown) => void;
  label?: string;
}) {
  if (typeof value === 'boolean') {
    return (
      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={value}
          onChange={(e) => onChange(e.target.checked)}
        />
        {label ?? '值'}
      </label>
    );
  }

  if (typeof value === 'number') {
    return (
      <Field label={label ?? '值'}>
        <input
          type="number"
          className={INPUT}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
        />
      </Field>
    );
  }

  if (typeof value === 'string') {
    return (
      <Field label={label ?? '值'}>
        <input
          type="text"
          className={INPUT}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </Field>
    );
  }

  if (Array.isArray(value)) {
    if (value.length === 0) {
      return (
        <p className="text-fd-muted-foreground text-sm">{label ?? '空数组'}</p>
      );
    }

    if (isNumberArray(value)) {
      return (
        <Field label={label ?? 'ID 列表'}>
          <input
            type="text"
            className={INPUT}
            value={value.join(', ')}
            onChange={(e) => onChange(parseCommaNumbers(e.target.value))}
            placeholder="1, 2, 3"
          />
        </Field>
      );
    }

    if (isStringArray(value)) {
      return (
        <Field label={label ?? '列表'}>
          <input
            type="text"
            className={INPUT}
            value={value.join(', ')}
            onChange={(e) => onChange(parseCommaStrings(e.target.value))}
            placeholder="tag1, tag2"
          />
        </Field>
      );
    }

    if (value.length === 1 && Array.isArray(value[0])) {
      const inner = value[0] as unknown[];
      return (
        <ArgEditor
          label={label ?? 'ID 列表'}
          value={inner}
          onChange={(inner) => onChange([inner])}
        />
      );
    }

    if (value.every(isPlainObject)) {
      return (
        <Accordions type="multiple">
          {value.map((item, i) => (
            <Accordion key={i} title={`${label ?? '项'} ${i + 1}`} id={`item-${i}`}>
              <ObjectEditor
                value={item as Record<string, unknown>}
                onChange={(newItem) => {
                  const next = [...value];
                  next[i] = newItem;
                  onChange(next);
                }}
              />
            </Accordion>
          ))}
        </Accordions>
      );
    }
  }

  if (isPlainObject(value)) {
    return <ObjectEditor value={value} onChange={onChange} />;
  }

  return null;
}

export function ArgsForm({
  defaultArgsJson,
  onChange,
}: {
  defaultArgsJson: string;
  onChange: (argsJson: string) => void;
}) {
  const initialValues = useMemo(() => {
    try {
      const parsed = JSON.parse(defaultArgsJson);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }, [defaultArgsJson]);

  const [values, setValues] = useState<unknown[]>(initialValues);
  const [advancedJson, setAdvancedJson] = useState(defaultArgsJson);

  const smartFormSupported = useMemo(
    () => values.every((v) => canRenderValue(v)),
    [values],
  );

  useEffect(() => {
    setValues(initialValues);
    setAdvancedJson(defaultArgsJson);
  }, [defaultArgsJson, initialValues]);

  const syncValues = useCallback(
    (next: unknown[]) => {
      setValues(next);
      const json = JSON.stringify(next);
      setAdvancedJson(json);
      onChange(json);
    },
    [onChange],
  );

  const handleAdvancedChange = useCallback(
    (raw: string) => {
      setAdvancedJson(raw);
      onChange(raw);
      try {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) setValues(parsed);
      } catch {
        // keep form state until valid JSON
      }
    },
    [onChange],
  );

  if (values.length === 0) {
    return (
      <Accordions type="single">
        <Accordion title="高级 JSON 模式" id="advanced-json">
          <textarea
            className={TEXTAREA}
            rows={4}
            value={advancedJson}
            onChange={(e) => handleAdvancedChange(e.target.value)}
          />
        </Accordion>
      </Accordions>
    );
  }

  return (
    <div className="space-y-3">
      {values.length === 1 ? (
        <ArgEditor
          label="参数"
          value={values[0]}
          onChange={(v) => syncValues([v])}
        />
      ) : (
        <Accordions type="multiple">
          {values.map((arg, i) => (
            <Accordion key={i} title={`参数 ${i + 1}`} id={`arg-${i}`}>
              <ArgEditor
                value={arg}
                onChange={(v) => {
                  const next = [...values];
                  next[i] = v;
                  syncValues(next);
                }}
              />
            </Accordion>
          ))}
        </Accordions>
      )}

      {!smartFormSupported ? (
        <p className="text-fd-muted-foreground text-sm">
          部分参数结构较复杂，请使用下方高级 JSON 模式编辑。
        </p>
      ) : null}

      <Accordions type="single">
        <Accordion title="高级 JSON 模式" id="advanced-json">
          <textarea
            className={TEXTAREA}
            rows={4}
            value={advancedJson}
            onChange={(e) => handleAdvancedChange(e.target.value)}
          />
        </Accordion>
      </Accordions>
    </div>
  );
}
