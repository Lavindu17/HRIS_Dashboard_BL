import React, { useMemo, useState } from "react";
import {
    ComposedChart,
    BarChart,
    Bar,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    Cell,
} from "recharts";

/* ------------------------------------------------------------------ */
/*  Design tokens                                                      */
/* ------------------------------------------------------------------ */
const COLORS = {
    canvas: "#0B1220",       // Dark background
    ink: "#E7ECF5",          // Bright text
    inkSoft: "#8A9AB5",      // Muted text
    surface: "#111A2B",      // Panel background
    border: "#22304A",       // Border color
    borderStrong: "#2E3F5C",  // Stronger border on hover
    onTime: "#3ED598",       // Vibrant emerald
    late: "#F2B84B",         // Vibrant amber
    leave: "#A78BFA",        // Purple — on leave
    noPunch: "#F2666B",      // Red — still hasn't punched in
    baseline: "#7C93C4",     // Muted steel blue (used for the headcount line)
    metric: "#818CF8",       // Indigo
};

const CATEGORY_PALETTE = [
    "#38BDF8", // Cyan
    "#3ED598", // Green
    "#818CF8", // Indigo
    "#F2666B", // Red
    "#F2B84B", // Amber
    "#A78BFA", // Purple
    "#FB7185", // Rose
    "#F43F5E", // Dark Rose
];

const FONT_IMPORT =
    "@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap');";

/* ------------------------------------------------------------------ */
/*  Mock workforce dataset (single source of truth for all 3 charts)   */
/* ------------------------------------------------------------------ */
const DEPARTMENTS = [
    "Sales", "Procurement", "Finance", "HR", "Engineering", "Operations", "Support",
];
const AGE_BANDS = ["20-25", "26-30", "31-35", "36-40", "41-45", "46+"];
const LOCATIONS = ["HQ - Colombo", "Kandy Branch", "Galle Branch", "Remote"];
const SENIORITY = ["Junior", "Mid", "Senior", "Lead", "Manager"];
const EDUCATION = ["Diploma", "Bachelor", "Master", "PhD"];
const GENDER = ["Male", "Female"];
const DISTANCE_BANDS = ["<5km", "5-15km", "15-30km", "30km+"];
const WORK_MODE = ["On-site", "Hybrid", "Remote"];

const FIRST_NAMES = [
    "Nimal", "Kasun", "Chamara", "Dilani", "Sanduni", "Ishara", "Tharindu",
    "Kavindi", "Ruwan", "Nadeeka", "Priyanka", "Suresh", "Anjali", "Rajitha",
    "Malsha", "Chathura", "Dilshan", "Hansika", "Yasas", "Nethmi", "Vinod",
    "Prasanna", "Chandima", "Sachini", "Buddhika", "Iresha", "Lakmal", "Oshadi",
];
const LAST_NAMES = [
    "Perera", "Fernando", "Silva", "Bandara", "Wijesinghe", "Rathnayake",
    "Gunawardena", "Jayasuriya", "Weerasinghe", "Kariyawasam", "Dissanayake",
    "Amarasinghe",
];

function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function rand(min, max) { return Math.random() * (max - min) + min; }
function fmtDate(d) {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
}

/** Last N business days ending today, chronological order. */
function generateBusinessDays(n = 60) {
    const out = [];
    let d = new Date();
    while (out.length < n) {
        const dow = d.getDay();
        if (dow !== 0 && dow !== 6) out.push(fmtDate(d));
        d.setDate(d.getDate() - 1);
    }
    return out.reverse();
}

const BUSINESS_DAYS = generateBusinessDays(60);
const MIN_DATE = BUSINESS_DAYS[0];
const MAX_DATE = BUSINESS_DAYS[BUSINESS_DAYS.length - 1];

function generateEmployees(n = 154) {
    const employees = [];
    for (let i = 0; i < n; i++) {
        const seniority = pick(SENIORITY);
        const seniorityMultiplier =
            { Junior: 1, Mid: 1.4, Senior: 1.9, Lead: 2.4, Manager: 3 }[seniority] || 1;

        // Per-employee behavioural bias so patterns aren't uniform across days.
        const punctualityBias = rand(0, 1); // higher = more punctual
        const otBias = rand(0.2, 1.6);
        const leaveBias = rand(0.4, 1.8);

        const daily = {};
        BUSINESS_DAYS.forEach((dateStr) => {
            const leaveRoll = Math.random();
            if (leaveRoll < 0.05 * leaveBias) {
                daily[dateStr] = { status: "leave", otHours: 0, lateMin: 0, earlyMin: 0, halfDay: false };
                return;
            }
            const absentRoll = Math.random();
            if (absentRoll < 0.02) {
                daily[dateStr] = { status: "absent", otHours: 0, lateMin: 0, earlyMin: 0, halfDay: false };
                return;
            }
            const halfDay = Math.random() < 0.03;
            const lateRoll = Math.random();
            const isLate = lateRoll > 0.5 + punctualityBias * 0.4;
            const status = isLate ? "late" : "onTime";
            const lateMin = isLate ? Math.round(rand(5, 40)) : 0;
            const earlyMin = Math.random() < 0.12 ? Math.round(rand(5, 30)) : 0;
            const otHours = Math.random() < 0.4 ? +(rand(0, 3.5) * otBias).toFixed(1) : 0;
            daily[dateStr] = { status, otHours, lateMin, earlyMin, halfDay };
        });

        employees.push({
            id: i + 1,
            name: `${pick(FIRST_NAMES)} ${pick(LAST_NAMES)}`,
            department: pick(DEPARTMENTS),
            ageBand: pick(AGE_BANDS),
            workLocation: pick(LOCATIONS),
            seniorityLevel: seniority,
            educationLevel: pick(EDUCATION),
            gender: pick(GENDER),
            distanceBand: pick(DISTANCE_BANDS),
            workMode: pick(WORK_MODE),
            monthlySalary: Math.round((45000 + seniorityMultiplier * 28000 + rand(-4000, 6000)) / 100) * 100,
            exited: Math.random() < 0.06,
            productivity: +rand(55, 98).toFixed(0),
            satisfaction: +rand(40, 95).toFixed(0),
            kpi: +rand(50, 99).toFixed(0),
            daily,
        });
    }
    return employees;
}

/** Aggregate one employee's daily records over [startStr, endStr] inclusive. */
function computeRangeStats(employee, startStr, endStr) {
    const stats = {
        workingDays: 0, presentDays: 0,
        otHoursSum: 0, lateCount: 0, leaveCount: 0, absentCount: 0,
        halfDayCount: 0, earlyCount: 0, lateMinSum: 0, earlyMinSum: 0,
    };
    for (const dateStr of BUSINESS_DAYS) {
        if (dateStr < startStr || dateStr > endStr) continue;
        const rec = employee.daily[dateStr];
        if (!rec) continue;
        stats.workingDays += 1;
        if (rec.status === "leave") { stats.leaveCount += 1; continue; }
        if (rec.status === "absent") { stats.absentCount += 1; continue; }
        stats.presentDays += 1;
        if (rec.status === "late") { stats.lateCount += 1; stats.lateMinSum += rec.lateMin; }
        if (rec.halfDay) stats.halfDayCount += 1;
        if (rec.earlyMin > 0) { stats.earlyCount += 1; stats.earlyMinSum += rec.earlyMin; }
        stats.otHoursSum += rec.otHours;
    }
    return stats;
}

/* ------------------------------------------------------------------ */
/*  Aggregation config                                                 */
/* ------------------------------------------------------------------ */
const X_DIMENSIONS = [
    { id: "ageBand", label: "Age band", order: AGE_BANDS },
    { id: "workLocation", label: "Work location", order: null },
    { id: "seniorityLevel", label: "Seniority level", order: SENIORITY },
    { id: "educationLevel", label: "Education level", order: EDUCATION },
    { id: "gender", label: "Gender", order: GENDER },
    { id: "distanceBand", label: "Distance to office", order: DISTANCE_BANDS },
    { id: "workMode", label: "Work mode", order: WORK_MODE },
];

const LINE_METRICS = {
    avgSalary: { label: "Avg monthly salary", unit: "LKR", agg: "avg", decimals: 0, get: (e) => e.monthlySalary },
    avgOT: { label: "Avg OT hours", unit: "hrs", agg: "avg", decimals: 1, get: (e, s) => s.otHoursSum },
    totalOT: { label: "Total OT hours", unit: "hrs", agg: "sum", decimals: 0, get: (e, s) => s.otHoursSum },
    leaveRate: { label: "Leave rate", unit: "%", agg: "avgPct", decimals: 1, get: (e, s) => (s.workingDays ? s.leaveCount / s.workingDays : 0) },
    avgEarlyMin: { label: "Avg early-leave minutes", unit: "min", agg: "avg", decimals: 0, get: (e, s) => (s.earlyCount ? s.earlyMinSum / s.earlyCount : 0) },
    avgLateMin: { label: "Avg late minutes", unit: "min", agg: "avg", decimals: 0, get: (e, s) => (s.lateCount ? s.lateMinSum / s.lateCount : 0) },
    exits: { label: "Exits", unit: "people", agg: "sum", decimals: 0, get: (e) => (e.exited ? 1 : 0) },
    productivity: { label: "Productivity score", unit: "idx", agg: "avg", decimals: 0, get: (e) => e.productivity },
    satisfaction: { label: "Satisfaction score", unit: "idx", agg: "avg", decimals: 0, get: (e) => e.satisfaction },
    kpi: { label: "KPI score", unit: "idx", agg: "avg", decimals: 0, get: (e) => e.kpi },
};

const PERSON_METRICS = {
    totalOTHours: { label: "Total OT hours", unit: "hrs", get: (s) => +s.otHoursSum.toFixed(1) },
    totalLeaves: { label: "Total leaves", unit: "days", get: (s) => s.leaveCount },
    halfDays: { label: "Half days", unit: "days", get: (s) => s.halfDayCount },
    lateDays: { label: "Late days", unit: "days", get: (s) => s.lateCount },
    earlyLeaves: { label: "Early leaves", unit: "days", get: (s) => s.earlyCount },
};

function aggregateByDimension(employees, dimId, metricId, startStr, endStr) {
    const dim = X_DIMENSIONS.find((d) => d.id === dimId);
    const metric = LINE_METRICS[metricId];
    const map = {};
    employees.forEach((e) => {
        const stats = computeRangeStats(e, startStr, endStr);
        const key = e[dimId];
        if (!map[key]) map[key] = { group: key, count: 0, sum: 0 };
        map[key].count += 1;
        map[key].sum += metric.get(e, stats);
    });
    let rows = Object.values(map).map((g) => {
        let value;
        if (metric.agg === "sum") value = +g.sum.toFixed(metric.decimals);
        else if (metric.agg === "avgPct") value = +((g.sum / g.count) * 100).toFixed(metric.decimals);
        else value = +(g.sum / g.count).toFixed(metric.decimals);
        return { group: g.group, headcount: g.count, metric: value };
    });
    rows = dim.order
        ? dim.order.map((o) => rows.find((r) => r.group === o)).filter(Boolean)
        : rows.sort((a, b) => b.headcount - a.headcount);
    return rows;
}

function aggregateByDepartmentForDate(employees, dateStr) {
    const map = {};
    employees.forEach((e) => {
        if (!map[e.department]) map[e.department] = { department: e.department, total: 0, onTime: 0, late: 0, leave: 0, noPunch: 0 };
        map[e.department].total += 1;
        const rec = e.daily[dateStr];
        if (!rec) { map[e.department].noPunch += 1; return; }
        if (rec.status === "onTime") map[e.department].onTime += 1;
        else if (rec.status === "late") map[e.department].late += 1;
        else if (rec.status === "leave") map[e.department].leave += 1;
        else if (rec.status === "absent") map[e.department].noPunch += 1; // hasn't punched in / unaccounted for
    });
    return Object.values(map).sort((a, b) => b.total - a.total);
}

/* ------------------------------------------------------------------ */
/*  Small UI atoms                                                     */
/* ------------------------------------------------------------------ */
function Eyebrow({ children }) {
    return (
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: COLORS.inkSoft, marginBottom: 4 }}>
            {children}
        </div>
    );
}

function Select({ value, onChange, options }) {
    const [hover, setHover] = useState(false);
    return (
        <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            style={{
                fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: COLORS.ink,
                background: "#16223F", border: `1px solid ${hover ? COLORS.borderStrong : COLORS.border}`,
                borderRadius: 6, padding: "6px 10px", cursor: "pointer", outline: "none",
                transition: "all 0.15s",
            }}
        >
            {options.map((o) => (
                <option key={o.value} value={o.value} style={{ background: "#111A2B", color: COLORS.ink }}>
                    {o.label}
                </option>
            ))}
        </select>
    );
}

function DateInput({ value, onChange, label }) {
    const [hover, setHover] = useState(false);
    return (
        <label style={{ display: "flex", alignItems: "center", gap: 6, fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: COLORS.inkSoft }}>
            {label && <span>{label}</span>}
            <input
                type="date"
                value={value}
                min={MIN_DATE}
                max={MAX_DATE}
                onChange={(e) => onChange(e.target.value)}
                onMouseEnter={() => setHover(true)}
                onMouseLeave={() => setHover(false)}
                style={{
                    fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: COLORS.ink,
                    background: "#16223F", border: `1px solid ${hover ? COLORS.borderStrong : COLORS.border}`,
                    borderRadius: 6, padding: "5px 8px", outline: "none",
                    transition: "all 0.15s",
                }}
            />
        </label>
    );
}

function Panel({ eyebrow, title, controls, children }) {
    return (
        <section style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 12, padding: "22px 24px 18px", marginBottom: 20, boxShadow: "0 4px 20px rgba(0,0,0,0.15)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12, marginBottom: 18 }}>
                <div>
                    <Eyebrow>{eyebrow}</Eyebrow>
                    <h2 style={{ fontFamily: "'Inter', sans-serif", fontSize: 17, fontWeight: 700, color: COLORS.ink, margin: 0 }}>{title}</h2>
                </div>
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>{controls}</div>
            </div>
            {children}
        </section>
    );
}

function KpiCard({ label, value, sub, color }) {
    return (
        <div style={{
            background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 12,
            padding: "18px 20px", minWidth: 160, flex: "1 1 200px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.2)", transition: "all 0.2s"
        }}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: COLORS.inkSoft, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>
                {label}
            </div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 28, fontWeight: 600, color: color || COLORS.ink }}>
                {value}
            </div>
            {sub && <div style={{ fontSize: 11, color: COLORS.inkSoft, marginTop: 5 }}>{sub}</div>}
        </div>
    );
}

function CustomTooltip({ active, payload, label, unit }) {
    if (!active || !payload || !payload.length) return null;
    return (
        <div style={{
            background: "#0D1526",
            border: `1px solid ${COLORS.borderStrong}`,
            color: COLORS.ink,
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 12,
            padding: "10px 12px",
            borderRadius: 6,
            lineHeight: 1.6,
            boxShadow: "0 4px 20px rgba(0,0,0,0.5)"
        }}>
            <div style={{ color: COLORS.inkSoft, marginBottom: 6 }}>{label}</div>
            {payload.map((p, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", gap: 16, color: p.color, marginBottom: 2 }}>
                    <span>{p.name}</span>
                    <span style={{ fontWeight: 600 }}>{Number(p.value).toLocaleString()}{p.name === "headcount" ? "" : ` ${unit || ""}`}</span>
                </div>
            ))}
        </div>
    );
}

/* ------------------------------------------------------------------ */
/*  Chart 1 — Attendance by department (single date)                   */
/*  Stacked bars = present split (on time / late).                     */
/*  Line = active headcount for the department (replaces the old grey  */
/*  low-opacity backdrop bar).                                         */
/* ------------------------------------------------------------------ */
function AttendanceChart({ employees }) {
    const [dateStr, setDateStr] = useState(MAX_DATE);
    const data = useMemo(() => aggregateByDepartmentForDate(employees, dateStr), [employees, dateStr]);
    const totals = data.reduce(
        (acc, d) => ({
            total: acc.total + d.total,
            onTime: acc.onTime + d.onTime,
            late: acc.late + d.late,
            leave: acc.leave + d.leave,
            noPunch: acc.noPunch + d.noPunch,
        }),
        { total: 0, onTime: 0, late: 0, leave: 0, noPunch: 0 }
    );

    const LEGEND_LABELS = {
        total: "Active headcount",
        onTime: "Present · on time",
        late: "Present · late",
        leave: "On leave",
        noPunch: "Not punched in yet",
    };

    return (
        <Panel
            eyebrow={`Snapshot · ${dateStr}`}
            title="Attendance by department"
            controls={
                <>
                    <DateInput label="Date" value={dateStr} onChange={setDateStr} />
                    <div style={{ display: "flex", gap: 14, flexWrap: "wrap", fontFamily: "'JetBrains Mono', monospace", fontSize: 12, marginLeft: 8 }}>
                        <span style={{ color: COLORS.inkSoft }}>HEADCOUNT <b style={{ color: COLORS.ink }}>{totals.total}</b></span>
                        <span style={{ color: COLORS.onTime }}>ON TIME <b style={{ textShadow: `0 0 6px ${COLORS.onTime}` }}>{totals.onTime}</b></span>
                        <span style={{ color: COLORS.late }}>LATE <b style={{ textShadow: `0 0 6px ${COLORS.late}` }}>{totals.late}</b></span>
                        <span style={{ color: COLORS.leave }}>LEAVE <b style={{ textShadow: `0 0 6px ${COLORS.leave}` }}>{totals.leave}</b></span>
                        <span style={{ color: COLORS.noPunch }}>NO PUNCH <b style={{ textShadow: `0 0 6px ${COLORS.noPunch}` }}>{totals.noPunch}</b></span>
                    </div>
                </>
            }
        >
            <ResponsiveContainer width="100%" height={320}>
                <ComposedChart data={data} margin={{ top: 8, right: 16, left: -10, bottom: 8 }}>
                    <CartesianGrid vertical={false} stroke={COLORS.border} strokeDasharray="3 3" />
                    <XAxis dataKey="department" tick={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fill: COLORS.inkSoft }} axisLine={{ stroke: COLORS.border }} tickLine={false} />
                    <YAxis tick={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fill: COLORS.inkSoft }} axisLine={false} tickLine={false} />
                    <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255,255,255,0.02)" }} />
                    <Legend
                        wrapperStyle={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11 }}
                        formatter={(v) => <span style={{ color: COLORS.inkSoft }}>{LEGEND_LABELS[v] || v}</span>}
                    />
                    <Bar dataKey="onTime" name="onTime" stackId="attendance" fill={COLORS.onTime} barSize={34} />
                    <Bar dataKey="late" name="late" stackId="attendance" fill={COLORS.late} barSize={34} />
                    <Bar dataKey="leave" name="leave" stackId="attendance" fill={COLORS.leave} barSize={34} />
                    <Bar dataKey="noPunch" name="noPunch" stackId="attendance" fill={COLORS.noPunch} barSize={34} radius={[4, 4, 0, 0]} />
                    <Line
                        type="monotone"
                        dataKey="total"
                        name="total"
                        stroke={COLORS.baseline}
                        strokeWidth={2.5}
                        strokeDasharray="5 3"
                        dot={{ r: 4, fill: COLORS.baseline, strokeWidth: 0 }}
                        activeDot={{ r: 6 }}
                    />
                </ComposedChart>
            </ResponsiveContainer>
        </Panel>
    );
}

/* ------------------------------------------------------------------ */
/*  Chart 2 — Demographic headcount + insight metric (date range)      */
/* ------------------------------------------------------------------ */
function DemographicsChart({ employees }) {
    const [xDim, setXDim] = useState("ageBand");
    const [metricId, setMetricId] = useState("avgOT");
    const [startStr, setStartStr] = useState(BUSINESS_DAYS[Math.max(0, BUSINESS_DAYS.length - 30)]);
    const [endStr, setEndStr] = useState(MAX_DATE);

    const data = useMemo(
        () => aggregateByDimension(employees, xDim, metricId, startStr, endStr),
        [employees, xDim, metricId, startStr, endStr]
    );
    const metric = LINE_METRICS[metricId];

    const insight = useMemo(() => {
        if (!data.length) return "";
        const top = [...data].sort((a, b) => b.metric - a.metric)[0];
        const bottom = [...data].sort((a, b) => a.metric - b.metric)[0];
        return `Insight Summary: Highest ${metric.label.toLowerCase()} is in ${top.group} (${top.metric}${metric.unit === "%" ? "%" : ""}). Lowest is in ${bottom.group} (${bottom.metric}${metric.unit === "%" ? "%" : ""}).`;
    }, [data, metric]);

    return (
        <Panel
            eyebrow={`Workforce demographics · ${startStr} → ${endStr}`}
            title="Headcount vs. selected insight"
            controls={
                <>
                    <Select value={xDim} onChange={setXDim} options={X_DIMENSIONS.map((d) => ({ value: d.id, label: d.label }))} />
                    <Select value={metricId} onChange={setMetricId} options={Object.entries(LINE_METRICS).map(([k, v]) => ({ value: k, label: v.label }))} />
                    <DateInput label="From" value={startStr} onChange={(v) => (v <= endStr ? setStartStr(v) : null)} />
                    <DateInput label="To" value={endStr} onChange={(v) => (v >= startStr ? setEndStr(v) : null)} />
                </>
            }
        >
            <ResponsiveContainer width="100%" height={340}>
                <ComposedChart data={data} margin={{ top: 8, right: 12, left: -10, bottom: 8 }}>
                    <CartesianGrid vertical={false} stroke={COLORS.border} strokeDasharray="3 3" />
                    <XAxis dataKey="group" tick={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fill: COLORS.inkSoft }} axisLine={{ stroke: COLORS.border }} tickLine={false} />
                    <YAxis
                        yAxisId="left"
                        tick={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fill: COLORS.inkSoft }}
                        axisLine={false} tickLine={false}
                        label={{ value: "Headcount", angle: -90, position: "insideLeft", offset: -2, style: { fontFamily: "'JetBrains Mono', monospace", fontSize: 10, fill: COLORS.inkSoft } }}
                    />
                    <YAxis
                        yAxisId="right" orientation="right"
                        tick={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fill: COLORS.metric }}
                        axisLine={false} tickLine={false}
                        label={{ value: metric.unit, angle: 90, position: "insideRight", offset: 2, style: { fontFamily: "'JetBrains Mono', monospace", fontSize: 10, fill: COLORS.metric } }}
                    />
                    <Tooltip content={<CustomTooltip unit={metric.unit} />} cursor={{ fill: "rgba(255,255,255,0.02)" }} />
                    <Legend wrapperStyle={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11 }} formatter={(v) => <span style={{ color: COLORS.inkSoft }}>{v === "headcount" ? "Headcount" : metric.label}</span>} />
                    <Bar yAxisId="left" dataKey="headcount" name="headcount" barSize={34} radius={[3, 3, 0, 0]}>
                        {data.map((_, i) => <Cell key={i} fill={CATEGORY_PALETTE[i % CATEGORY_PALETTE.length]} fillOpacity={0.7} />)}
                    </Bar>
                    <Line yAxisId="right" type="monotone" dataKey="metric" name="metric" stroke={COLORS.metric} strokeWidth={2.5} dot={{ r: 4, fill: COLORS.metric }} />
                </ComposedChart>
            </ResponsiveContainer>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: COLORS.inkSoft, borderTop: `1px solid ${COLORS.border}`, padding: "12px 2px 4px", marginTop: 10 }}>
                {insight}
            </div>
        </Panel>
    );
}

/* ------------------------------------------------------------------ */
/*  Chart 3 — Person-wise metric (department/company + date range)     */
/* ------------------------------------------------------------------ */
function PersonWiseChart({ employees }) {
    const [metricId, setMetricId] = useState("totalOTHours");
    const [scope, setScope] = useState("Company");
    const [limit, setLimit] = useState(15);
    const [startStr, setStartStr] = useState(BUSINESS_DAYS[Math.max(0, BUSINESS_DAYS.length - 30)]);
    const [endStr, setEndStr] = useState(MAX_DATE);
    const metric = PERSON_METRICS[metricId];

    const data = useMemo(() => {
        const pool = scope === "Company" ? employees : employees.filter((e) => e.department === scope);
        return pool
            .map((e) => ({ name: e.name, department: e.department, value: metric.get(computeRangeStats(e, startStr, endStr)) }))
            .sort((a, b) => b.value - a.value)
            .slice(0, limit);
    }, [employees, metricId, scope, limit, startStr, endStr]);

    return (
        <Panel
            eyebrow={`Individual · ranked · ${startStr} → ${endStr}`}
            title="Person-wise breakdown"
            controls={
                <>
                    <Select value={scope} onChange={setScope} options={[{ value: "Company", label: "Company (all)" }, ...DEPARTMENTS.map((d) => ({ value: d, label: d }))]} />
                    <Select value={metricId} onChange={setMetricId} options={Object.entries(PERSON_METRICS).map(([k, v]) => ({ value: k, label: v.label }))} />
                    <Select value={String(limit)} onChange={(v) => setLimit(Number(v))} options={[{ value: "10", label: "Top 10" }, { value: "15", label: "Top 15" }, { value: "25", label: "Top 25" }]} />
                    <DateInput label="From" value={startStr} onChange={(v) => (v <= endStr ? setStartStr(v) : null)} />
                    <DateInput label="To" value={endStr} onChange={(v) => (v >= startStr ? setEndStr(v) : null)} />
                </>
            }
        >
            <ResponsiveContainer width="100%" height={Math.max(320, data.length * 26)}>
                <BarChart data={data} layout="vertical" margin={{ top: 4, right: 32, left: 10, bottom: 4 }} barCategoryGap="24%">
                    <CartesianGrid horizontal={false} stroke={COLORS.border} strokeDasharray="3 3" />
                    <XAxis
                        type="number"
                        tick={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fill: COLORS.inkSoft }}
                        axisLine={{ stroke: COLORS.border }} tickLine={false}
                        label={{ value: metric.unit, position: "insideBottomRight", offset: -2, style: { fontFamily: "'JetBrains Mono', monospace", fontSize: 10, fill: COLORS.inkSoft } }}
                    />
                    <YAxis type="category" dataKey="name" width={130} tick={{ fontFamily: "'Inter', sans-serif", fontSize: 12, fill: COLORS.ink }} axisLine={false} tickLine={false} />
                    <Tooltip content={<CustomTooltip unit={metric.unit} />} cursor={{ fill: "rgba(255,255,255,0.02)" }} />
                    <Bar dataKey="value" name={metric.label} radius={[0, 4, 4, 0]} barSize={14}>
                        {data.map((_, i) => <Cell key={i} fill={i < 3 ? COLORS.late : COLORS.metric} fillOpacity={i < 3 ? 1 : 0.75} />)}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </Panel>
    );
}

/* ------------------------------------------------------------------ */
/*  App                                                                 */
/* ------------------------------------------------------------------ */
export default function WorkforceDashboard() {
    const employees = useMemo(() => generateEmployees(154), []);
    const dept = useMemo(() => aggregateByDepartmentForDate(employees, MAX_DATE), [employees]);
    const totals = dept.reduce(
        (acc, d) => ({
            total: acc.total + d.total,
            onTime: acc.onTime + d.onTime,
            late: acc.late + d.late,
            leave: acc.leave + d.leave,
            noPunch: acc.noPunch + d.noPunch,
        }),
        { total: 0, onTime: 0, late: 0, leave: 0, noPunch: 0 }
    );

    return (
        <div style={{ background: COLORS.canvas, minHeight: "100%", padding: "28px 24px 40px", color: COLORS.ink }}>
            <style>{FONT_IMPORT}</style>
            <header style={{ marginBottom: 24 }}>
                <Eyebrow>Dashboard</Eyebrow>
                <h1 style={{ fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: 26, color: COLORS.ink, margin: "2px 0 16px" }}>
                    Attendance &amp; demographic overview
                </h1>

                {/* Unified KPI Row */}
                <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginTop: 16 }}>
                    <KpiCard label="Headcount" value={totals.total} sub="Total active workforce" color={COLORS.ink} />
                    <KpiCard label="On time" value={totals.onTime} sub={`${((totals.onTime / totals.total) * 100).toFixed(1)}% of headcount`} color={COLORS.onTime} />
                    <KpiCard label="Late" value={totals.late} sub={`${((totals.late / totals.total) * 100).toFixed(1)}% of headcount`} color={COLORS.late} />
                    <KpiCard label="On leave" value={totals.leave} sub={`${((totals.leave / totals.total) * 100).toFixed(1)}% of headcount`} color={COLORS.leave} />
                    <KpiCard label="Not punched in" value={totals.noPunch} sub={`${((totals.noPunch / totals.total) * 100).toFixed(1)}% of headcount`} color={COLORS.noPunch} />
                </div>
            </header>

            <AttendanceChart employees={employees} />
            <DemographicsChart employees={employees} />
            <PersonWiseChart employees={employees} />
        </div>
    );
}