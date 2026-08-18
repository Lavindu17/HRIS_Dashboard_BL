import React, { useState, useMemo } from "react";
import {
  ComposedChart, Area, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  Legend, ResponsiveContainer, ReferenceLine,
  BarChart, Bar, Cell, PieChart, Pie,
} from "recharts";

const DATA = [
  {"id":"PRJ-001","name":"Riverside Tower","scenario":"Doing Great (Ahead & Under Budget)","pm":"A. Fernando","bac":4200000,"status":"Green","dataAsOf":8,"duration":12,"tasks":{"total":88,"ongoing":28,"delayed":6,"finished":54},"curve":[{"period":1,"date":"2025-11","pv":84130,"ev":85114,"ac":84278,"early":184869,"late":14006},{"period":2,"date":"2025-12","pv":232798,"ev":237967,"ac":237405,"early":527254,"late":43363},{"period":3,"date":"2026-01","pv":484196,"ev":495513,"ac":476065,"early":1089318,"late":104229},{"period":4,"date":"2026-02","pv":879241,"ev":932563,"ac":888628,"early":1851614,"late":227607},{"period":5,"date":"2026-03","pv":1433689,"ev":1506177,"ac":1401574,"early":2655936,"late":466662},{"period":6,"date":"2026-04","pv":2100000,"ev":2236047,"ac":2017415,"early":3308199,"late":891801},{"period":7,"date":"2026-05","pv":2766311,"ev":3001883,"ac":2622304,"early":3733338,"late":1544064},{"period":8,"date":"2026-06","pv":3320759,"ev":3544705,"ac":3115741,"early":3972393,"late":2348386},{"period":9,"date":"2026-07","pv":3715804,"ev":null,"ac":null,"early":4095771,"late":3110682},{"period":10,"date":"2026-08","pv":3967202,"ev":null,"ac":null,"early":4156637,"late":3672746},{"period":11,"date":"2026-09","pv":4115870,"ev":null,"ac":null,"early":4185994,"late":4015131},{"period":12,"date":"2026-10","pv":4200000,"ev":null,"ac":null,"early":4200000,"late":4200000}],"metrics":{"spi":1.067,"cpi":1.138,"sv":223946,"cv":428964,"eac":3691735,"etc":575994,"vac":508265,"pctEarned":0.844,"pctSpent":0.742,"pctPlanned":0.791}},
  {"id":"PRJ-002","name":"Harbor Bridge Expansion","scenario":"Overrunning (Behind & Over Budget)","pm":"R. Silva","bac":8650000,"status":"Red","dataAsOf":9,"duration":12,"tasks":{"total":124,"ongoing":42,"delayed":54,"finished":28},"curve":[{"period":1,"date":"2025-09","pv":173211,"ev":140021,"ac":190228,"early":380671,"late":28840},{"period":2,"date":"2025-10","pv":479355,"ev":399233,"ac":523839,"early":1085569,"late":89285},{"period":3,"date":"2025-11","pv":997136,"ev":847822,"ac":1113203,"early":2243248,"late":214665},{"period":4,"date":"2025-12","pv":1810582,"ev":1548978,"ac":2058129,"early":3813664,"late":468828},{"period":5,"date":"2026-01","pv":2951899,"ev":2508469,"ac":3389117,"early":5469100,"late":961007},{"period":6,"date":"2026-02","pv":4325000,"ev":3568090,"ac":4915497,"early":6811768,"late":1836336},{"period":7,"date":"2026-03","pv":5698101,"ev":4571993,"ac":6349106,"early":7687236,"late":3180133},{"period":8,"date":"2026-04","pv":6839182,"ev":5473874,"ac":7452610,"early":8180058,"late":4838973},{"period":9,"date":"2026-05","pv":7652645,"ev":6076930,"ac":8168520,"early":8412198,"late":6404504},{"period":10,"date":"2026-06","pv":8170645,"ev":null,"ac":null,"early":8503577,"late":7565497},{"period":11,"date":"2026-07","pv":8476789,"ev":null,"ac":null,"early":8536631,"late":8253478},{"period":12,"date":"2026-08","pv":8650000,"ev":null,"ac":null,"early":8650000,"late":8650000}],"metrics":{"spi":0.794,"cpi":0.744,"sv":-1575715,"cv":-2091590,"eac":11940933,"etc":3772413,"vac":-3290933,"pctEarned":0.703,"pctSpent":0.944,"pctPlanned":0.885}},
  {"id":"PRJ-003","name":"Metro Rail Phase 2","scenario":"Better Than Expected (Ahead & Under Budget)","pm":"N. Perera","bac":6100000,"status":"Green","dataAsOf":7,"duration":12,"tasks":{"total":96,"ongoing":20,"delayed":4,"finished":72},"curve":[{"period":1,"date":"2025-12","pv":122122,"ev":132163,"ac":114037,"early":268409,"late":20337},{"period":2,"date":"2026-01","pv":338003,"ev":382957,"ac":314871,"early":765480,"late":62978},{"period":3,"date":"2026-02","pv":703152,"ev":822530,"ac":642780,"early":1581634,"late":151412},{"period":4,"date":"2026-03","pv":1276221,"ev":1533799,"ac":1156195,"early":2688098,"late":330362},{"period":5,"date":"2026-04","pv":2081716,"ev":2557423,"ac":1856691,"early":3857105,"late":677974},{"period":6,"date":"2026-05","pv":3050000,"ev":3684234,"ac":2646331,"early":4805217,"late":1294513},{"period":7,"date":"2026-06","pv":4018284,"ev":4761430,"ac":3396498,"early":5363310,"late":2242105},{"period":8,"date":"2026-07","pv":4823779,"ev":null,"ac":null,"early":5605581,"late":3357203},{"period":9,"date":"2026-08","pv":5396848,"ev":null,"ac":null,"early":5920022,"late":4560296},{"period":10,"date":"2026-09","pv":5761997,"ev":null,"ac":null,"early":6045772,"late":5570577},{"period":11,"date":"2026-10","pv":5961878,"ev":null,"ac":null,"early":6083817,"late":6014296},{"period":12,"date":"2026-11","pv":6100000,"ev":null,"ac":null,"early":6100000,"late":6100000}],"metrics":{"spi":1.185,"cpi":1.402,"sv":743146,"cv":1364932,"eac":4363068,"etc":966570,"vac":1736932,"pctEarned":0.781,"pctSpent":0.557,"pctPlanned":0.659}},
  {"id":"PRJ-004","name":"Greenfield Data Center","scenario":"Cost Overrun (On Schedule, Over Budget)","pm":"K. Jayasuriya","bac":5400000,"status":"Amber","dataAsOf":8,"duration":12,"tasks":{"total":72,"ongoing":30,"delayed":20,"finished":22},"curve":[{"period":1,"date":"2025-10","pv":108106,"ev":109038,"ac":118081,"early":237603,"late":18004},{"period":2,"date":"2025-11","pv":299198,"ev":300370,"ac":339284,"early":677700,"late":55759},{"period":3,"date":"2025-12","pv":622538,"ev":619959,"ac":730157,"early":1400415,"late":134010},{"period":4,"date":"2026-01","pv":1130024,"ev":1119259,"ac":1382274,"early":2379159,"late":292638},{"period":5,"date":"2026-02","pv":1843029,"ev":1798074,"ac":2312423,"early":3413489,"late":600140},{"period":6,"date":"2026-03","pv":2700000,"ev":2612514,"ac":3423412,"early":4253396,"late":1146386},{"period":7,"date":"2026-04","pv":3556970,"ev":3405358,"ac":4470108,"early":4801716,"late":1984506},{"period":8,"date":"2026-05","pv":4269975,"ev":4074854,"ac":5312389,"early":5108819,"late":3020190},{"period":9,"date":"2026-06","pv":4777461,"ev":null,"ac":null,"early":5257711,"late":4003347},{"period":10,"date":"2026-07","pv":5100802,"ev":null,"ac":null,"early":5346151,"late":4722370},{"period":11,"date":"2026-08","pv":5300801,"ev":null,"ac":null,"early":5388197,"late":5162361},{"period":12,"date":"2026-09","pv":5400000,"ev":null,"ac":null,"early":5400000,"late":5400000}],"metrics":{"spi":0.954,"cpi":0.767,"sv":-195121,"cv":-1237535,"eac":9645831,"etc":4333442,"vac":-4245831,"pctEarned":0.755,"pctSpent":0.984,"pctPlanned":0.791}},
  {"id":"PRJ-005","name":"Sunset Mall Renovation","scenario":"Schedule Slip (Behind, On Budget)","pm":"D. Wickrama","bac":3100000,"status":"Amber","dataAsOf":8,"duration":12,"tasks":{"total":60,"ongoing":24,"delayed":22,"finished":14},"curve":[{"period":1,"date":"2025-11","pv":62092,"ev":54169,"ac":54759,"early":136417,"late":10337},{"period":2,"date":"2025-12","pv":171893,"ev":146975,"ac":146497,"early":389124,"late":32017},{"period":3,"date":"2026-01","pv":357544,"ev":298346,"ac":301238,"early":804127,"late":76950},{"period":4,"date":"2026-02","pv":649007,"ev":525834,"ac":530626,"early":1366464,"late":168083},{"period":5,"date":"2026-03","pv":1058577,"ev":816917,"ac":831876,"early":1960228,"late":344557},{"period":6,"date":"2026-04","pv":1550000,"ev":1116503,"ac":1141684,"early":2442168,"late":658125},{"period":7,"date":"2026-05","pv":2041423,"ev":1379329,"ac":1414623,"early":2757196,"late":1139758},{"period":8,"date":"2026-06","pv":2450993,"ev":1583030,"ac":1631879,"early":2932787,"late":1734223},{"period":9,"date":"2026-07","pv":2742456,"ev":null,"ac":null,"early":3013764,"late":2299218},{"period":10,"date":"2026-08","pv":2928107,"ev":null,"ac":null,"early":3049866,"late":2716107},{"period":11,"date":"2026-09","pv":3037908,"ev":null,"ac":null,"early":3066090,"late":2989082},{"period":12,"date":"2026-10","pv":3100000,"ev":null,"ac":null,"early":3100000,"late":3100000}],"metrics":{"spi":0.646,"cpi":0.97,"sv":-867963,"cv":-48849,"eac":3231603,"etc":1599724,"vac":-131603,"pctEarned":0.511,"pctSpent":0.526,"pctPlanned":0.791}},
  {"id":"PRJ-006","name":"Northgate Hospital Wing","scenario":"Severely Troubled (Behind & Over Budget)","pm":"S. Gunawardena","bac":9800000,"status":"Red","dataAsOf":7,"duration":12,"tasks":{"total":152,"ongoing":38,"delayed":92,"finished":22},"curve":[{"period":1,"date":"2025-08","pv":196212,"ev":126972,"ac":180896,"early":431403,"late":32700},{"period":2,"date":"2025-09","pv":543491,"ev":362332,"ac":517341,"early":1230984,"late":101243},{"period":3,"date":"2025-10","pv":1130472,"ev":772993,"ac":1114791,"early":2544975,"late":243503},{"period":4,"date":"2025-11","pv":2052197,"ev":1409706,"ac":2038639,"early":4323540,"late":531412},{"period":5,"date":"2025-12","pv":3345601,"ev":2225461,"ac":3282345,"early":6203143,"late":1090235},{"period":6,"date":"2026-01","pv":4900000,"ev":3037523,"ac":4576523,"early":7731182,"late":2083548},{"period":7,"date":"2026-02","pv":6454399,"ev":3801699,"ac":5872612,"early":8632461,"late":3608497},{"period":8,"date":"2026-03","pv":7747803,"ev":null,"ac":null,"early":9066651,"late":5401857},{"period":9,"date":"2026-04","pv":8669528,"ev":null,"ac":null,"early":9310301,"late":7096504},{"period":10,"date":"2026-05","pv":9256509,"ev":null,"ac":null,"early":9558421,"late":8351994},{"period":11,"date":"2026-06","pv":9603788,"ev":null,"ac":null,"early":9670161,"late":9294544},{"period":12,"date":"2026-07","pv":9800000,"ev":null,"ac":null,"early":9800000,"late":9800000}],"metrics":{"spi":0.589,"cpi":0.647,"sv":-2652700,"cv":-2070913,"eac":15144219,"etc":9271607,"vac":-5344219,"pctEarned":0.388,"pctSpent":0.599,"pctPlanned":0.659}}
];

const COLORS = {
  bg: "#0B1220",
  panel: "#111A2B",
  panel2: "#0E1626",
  border: "#22304A",
  borderLight: "#2E3F5C",
  text: "#E7ECF5",
  textMuted: "#8A9AB5",
  textFaint: "#5C6D8A",
  pv: "#7C93C4",
  ev: "#3ED598",
  ac: "#F2666B",
  band: "#F2B84B",
  bandFill: "rgba(242,184,75,0.14)",
  green: "#3ED598",
  amber: "#F2B84B",
  red: "#F2666B",
};

const fmtMoney = (v) => {
  if (v === null || v === undefined) return "—";
  const abs = Math.abs(v);
  const sign = v < 0 ? "-" : "";
  if (abs >= 1_000_000) return `${sign}$${(abs / 1_000_000).toFixed(2)}M`;
  if (abs >= 1_000) return `${sign}$${(abs / 1_000).toFixed(0)}K`;
  return `${sign}$${abs}`;
};
const fmtIdx = (v) => (v === null || v === undefined ? "—" : v.toFixed(2));
const fmtPct = (v) => (v === null || v === undefined ? "—" : `${(v * 100).toFixed(0)}%`);

function StatusDot({ status }) {
  const c = status === "Green" ? COLORS.green : status === "Amber" ? COLORS.amber : COLORS.red;
  return <span style={{ width: 8, height: 8, borderRadius: 999, background: c, display: "inline-block", boxShadow: `0 0 8px ${c}` }} />;
}

function KpiCard({ label, value, sub, tone }) {
  const toneColor = tone === "good" ? COLORS.green : tone === "bad" ? COLORS.red : COLORS.text;
  return (
    <div style={{
      background: COLORS.panel, border: `1px solid ${COLORS.border}`, borderRadius: 10,
      padding: "14px 16px", minWidth: 0, flex: "1 1 140px",
    }}>
      <div style={{ fontSize: 11, letterSpacing: "0.06em", color: COLORS.textFaint, textTransform: "uppercase", marginBottom: 6 }}>{label}</div>
      <div style={{ fontSize: 22, fontWeight: 600, color: toneColor, fontVariantNumeric: "tabular-nums" }}>{value}</div>
      {sub && <div style={{ fontSize: 11, color: COLORS.textMuted, marginTop: 4 }}>{sub}</div>}
    </div>
  );
}

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload || !payload.length) return null;
  const rows = payload.filter(p => ["PV", "EV", "AC", "Optimistic bound", "Conservative bound"].includes(p.name) && p.value !== null && p.value !== undefined);
  if (!rows.length) return null;
  return (
    <div style={{ background: "#0D1526", border: `1px solid ${COLORS.borderLight}`, borderRadius: 8, padding: "10px 12px", fontSize: 12 }}>
      <div style={{ color: COLORS.textMuted, marginBottom: 6 }}>{label}</div>
      {rows.map((r) => (
        <div key={r.name} style={{ display: "flex", justifyContent: "space-between", gap: 16, color: r.color, marginBottom: 2 }}>
          <span>{r.name}</span>
          <span style={{ fontVariantNumeric: "tabular-nums" }}>{fmtMoney(r.value)}</span>
        </div>
      ))}
    </div>
  );
}

const TASK_COLORS = {
  finished: "#3ED598",  // green
  ongoing:  "#7C93C4",  // blue-grey
  delayed:  "#F2666B",  // red
};

/* ── Mini Donut per project (Tasks view) ──────────────────────────────── */
function ProjectDonut({ project, onSelect }) {
  const { tasks } = project;
  const segments = [
    { name: "Finished", value: tasks.finished, color: TASK_COLORS.finished },
    { name: "Ongoing",  value: tasks.ongoing,  color: TASK_COLORS.ongoing  },
    { name: "Delayed",  value: tasks.delayed,  color: TASK_COLORS.delayed  },
  ];
  const statusColor = project.status === "Green" ? COLORS.green : project.status === "Amber" ? COLORS.amber : COLORS.red;
  const shortName   = project.name.length > 16 ? project.name.slice(0, 16) + "…" : project.name;

  return (
    <div
      onClick={() => onSelect(project.id)}
      style={{
        background: COLORS.panel2, border: `1px solid ${COLORS.border}`, borderRadius: 10,
        padding: "14px 12px", cursor: "pointer", textAlign: "center",
        transition: "border-color 0.15s, box-shadow 0.15s", flex: "1 1 140px", minWidth: 140,
      }}
      onMouseEnter={(e) => { e.currentTarget.style.borderColor = statusColor; e.currentTarget.style.boxShadow = `0 0 12px ${statusColor}30`; }}
      onMouseLeave={(e) => { e.currentTarget.style.borderColor = COLORS.border; e.currentTarget.style.boxShadow = "none"; }}
    >
      {/* Donut */}
      <div style={{ position: "relative", display: "inline-block" }}>
        <PieChart width={110} height={110}>
          <Pie
            data={segments}
            cx={50} cy={50}
            innerRadius={32} outerRadius={50}
            dataKey="value"
            strokeWidth={2}
            stroke={COLORS.panel2}
            paddingAngle={2}
            isAnimationActive={true}
          >
            {segments.map((s, i) => <Cell key={i} fill={s.color} />)}
          </Pie>
          <Tooltip
            content={({ active, payload }) => {
              if (!active || !payload?.length) return null;
              const p = payload[0];
              return (
                <div style={{ background: "#0D1526", border: `1px solid ${COLORS.borderLight}`, borderRadius: 6, padding: "6px 10px", fontSize: 11 }}>
                  <span style={{ color: p.payload.color, fontWeight: 700 }}>{p.name}</span>
                  <span style={{ color: COLORS.text, marginLeft: 6 }}>{p.value}</span>
                </div>
              );
            }}
          />
        </PieChart>
        {/* Centre total */}
        <div style={{
          position: "absolute", top: "50%", left: "50%",
          transform: "translate(-50%, -50%)",
          textAlign: "center", pointerEvents: "none",
        }}>
          <div style={{ fontSize: 18, fontWeight: 800, color: COLORS.text, lineHeight: 1 }}>{tasks.total}</div>
          <div style={{ fontSize: 9, color: COLORS.textFaint, letterSpacing: "0.04em", marginTop: 2 }}>TOTAL</div>
        </div>
      </div>

      {/* Project name */}
      <div style={{ fontSize: 11, fontWeight: 600, color: COLORS.text, marginTop: 6, lineHeight: 1.3 }}>{shortName}</div>

      {/* Stats row */}
      <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 8, flexWrap: "wrap" }}>
        {segments.map((s) => (
          <div key={s.name} style={{ textAlign: "center" }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: 9, color: COLORS.textFaint, letterSpacing: "0.03em" }}>{s.name.toUpperCase()}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function PortfolioBarChart({ onSelect }) {
  const [chartView, setChartView] = useState("evm"); // "evm" | "tasks"

  /* ── EVM bar data ── */
  const evmData = DATA.map((p) => {
    const latest = p.curve.filter((c) => c.ev !== null && c.ac !== null).slice(-1)[0] || p.curve[0];
    return {
      id: p.id,
      name: p.name.length > 14 ? p.name.slice(0, 14) + "…" : p.name,
      fullName: p.name,
      EV: latest.ev ?? 0,
      PV: latest.pv ?? 0,
      AC: latest.ac ?? 0,
    };
  });

  const handleBarClick = (data) => {
    if (data && data.activePayload && data.activePayload[0]) {
      const entry = data.activePayload[0].payload;
      if (entry?.id) onSelect(entry.id);
    }
  };

  /* ── EVM tooltip ── */
  const EvmTooltip = ({ active, payload, label }) => {
    if (!active || !payload || !payload.length) return null;
    const entry = evmData.find((d) => d.name === label);
    return (
      <div style={{ background: "#0D1526", border: `1px solid ${COLORS.borderLight}`, borderRadius: 8, padding: "10px 14px", fontSize: 12 }}>
        <div style={{ color: COLORS.text, fontWeight: 600, marginBottom: 6 }}>{entry?.fullName ?? label}</div>
        {payload.map((p) => (
          <div key={p.name} style={{ display: "flex", justifyContent: "space-between", gap: 16, color: p.fill, marginBottom: 2 }}>
            <span>{p.name}</span>
            <span style={{ fontVariantNumeric: "tabular-nums", fontWeight: 600 }}>{fmtMoney(p.value)}</span>
          </div>
        ))}
        <div style={{ marginTop: 8, fontSize: 11, color: COLORS.textFaint }}>Click to drill into project →</div>
      </div>
    );
  };

  /* ── View toggle button ── */
  const TabBtn = ({ id, label }) => (
    <button onClick={() => setChartView(id)} style={{
      border: "none", cursor: "pointer", padding: "6px 14px", borderRadius: 6,
      fontSize: 12, fontWeight: 600,
      background: chartView === id ? COLORS.borderLight : "transparent",
      color: chartView === id ? COLORS.text : COLORS.textMuted,
      transition: "all 0.15s",
    }}>{label}</button>
  );

  /* ── Portfolio totals for task legend ── */
  const totals = {
    total:    DATA.reduce((s, p) => s + p.tasks.total,    0),
    finished: DATA.reduce((s, p) => s + p.tasks.finished, 0),
    ongoing:  DATA.reduce((s, p) => s + p.tasks.ongoing,  0),
    delayed:  DATA.reduce((s, p) => s + p.tasks.delayed,  0),
  };

  return (
    <div style={{
      background: COLORS.panel, border: `1px solid ${COLORS.border}`, borderRadius: 12,
      padding: 18,
    }}>
      {/* Header row */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 4, flexWrap: "wrap", gap: 8 }}>
        <div style={{ fontSize: 13, fontWeight: 700 }}>
          {chartView === "evm" ? "Portfolio EV / PV / AC — Latest Period" : "Portfolio Task Breakdown"}
        </div>
        <div style={{ display: "flex", gap: 3, background: COLORS.panel2, border: `1px solid ${COLORS.border}`, borderRadius: 8, padding: 3 }}>
          <TabBtn id="evm"   label="EVM" />
          <TabBtn id="tasks" label="Tasks" />
        </div>
      </div>
      <div style={{ fontSize: 11, color: COLORS.textMuted, marginBottom: 14 }}>
        {chartView === "evm"
          ? <>Earned Value, Planned Value, and Actual Cost at most recent data point · <span style={{ color: COLORS.ev }}>Click to drill into project</span></>
          : <>Total, Ongoing, Delayed & Finished tasks per project · <span style={{ color: COLORS.ev }}>Click any card to drill into that project</span></>}
      </div>

      {chartView === "evm" ? (
        <div style={{ height: 300 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={evmData} margin={{ top: 4, right: 12, left: 0, bottom: 4 }} barCategoryGap="28%" barGap={3}
              onClick={handleBarClick} style={{ cursor: "pointer" }}>
              <CartesianGrid stroke={COLORS.border} strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" tick={{ fill: COLORS.textFaint, fontSize: 11 }} axisLine={{ stroke: COLORS.border }} tickLine={false} />
              <YAxis tickFormatter={fmtMoney} tick={{ fill: COLORS.textFaint, fontSize: 11 }} axisLine={false} tickLine={false} width={60} />
              <Tooltip content={<EvmTooltip />} cursor={{ fill: "rgba(255,255,255,0.05)" }} />
              <Legend wrapperStyle={{ fontSize: 12, color: COLORS.textMuted, paddingTop: 8 }} />
              <Bar dataKey="PV" name="PV" fill={COLORS.pv} radius={[4, 4, 0, 0]} maxBarSize={28} />
              <Bar dataKey="EV" name="EV" fill={COLORS.ev} radius={[4, 4, 0, 0]} maxBarSize={28} />
              <Bar dataKey="AC" name="AC" fill={COLORS.ac} radius={[4, 4, 0, 0]} maxBarSize={28} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div>
          {/* Donut grid */}
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "space-between" }}>
            {DATA.map((p) => (
              <ProjectDonut key={p.id} project={p} onSelect={onSelect} />
            ))}
          </div>
          {/* Portfolio summary legend */}
          <div style={{ display: "flex", gap: 20, marginTop: 18, paddingTop: 14, borderTop: `1px solid ${COLORS.border}`, flexWrap: "wrap", alignItems: "center" }}>
            <span style={{ fontSize: 11, color: COLORS.textFaint, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>Portfolio Total</span>
            {[
              { label: "Total Tasks",    value: totals.total,    color: COLORS.textMuted },
              { label: "Finished",       value: totals.finished, color: TASK_COLORS.finished },
              { label: "Ongoing",        value: totals.ongoing,  color: TASK_COLORS.ongoing  },
              { label: "Delayed",        value: totals.delayed,  color: TASK_COLORS.delayed  },
            ].map(({ label, value, color }) => (
              <div key={label} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ width: 8, height: 8, borderRadius: 2, background: color, display: "inline-block" }} />
                <span style={{ fontSize: 11, color: COLORS.textMuted }}>{label}:</span>
                <span style={{ fontSize: 13, fontWeight: 700, color, fontVariantNumeric: "tabular-nums" }}>{value}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}


function PortfolioTable({ onSelect }) {
  const cpiColor = (v) => v >= 1 ? COLORS.green : v >= 0.9 ? COLORS.amber : COLORS.red;
  const spiColor = (v) => v >= 1 ? COLORS.green : v >= 0.9 ? COLORS.amber : COLORS.red;
  const eacColor = (v, bac) => v <= bac ? COLORS.green : v <= bac * 1.1 ? COLORS.amber : COLORS.red;
  const cellBg   = (v, bac) => v <= bac ? "rgba(62,213,152,0.08)" : v <= bac * 1.1 ? "rgba(242,184,75,0.08)" : "rgba(242,102,107,0.08)";
  const idxBg    = (v) => v >= 1 ? "rgba(62,213,152,0.08)" : v >= 0.9 ? "rgba(242,184,75,0.08)" : "rgba(242,102,107,0.08)";

  const cols = [
    { key: "id",     label: "ID",      align: "left"   },
    { key: "name",   label: "Project", align: "left"   },
    { key: "pm",     label: "PM",      align: "left"   },
    { key: "bac",    label: "BAC",     align: "right"  },
    { key: "cpi",    label: "CPI",     align: "right"  },
    { key: "spi",    label: "SPI",     align: "right"  },
    { key: "eac",    label: "EAC",     align: "right"  },
    { key: "etc",    label: "ETC",     align: "right"  },
    { key: "status", label: "Status",  align: "center" },
    { key: "drill",  label: "",        align: "center" },
  ];

  const thStyle = (align) => ({
    padding: "9px 12px", fontSize: 11, fontWeight: 700, letterSpacing: "0.05em",
    textTransform: "uppercase", color: COLORS.textFaint, textAlign: align,
    borderBottom: `1px solid ${COLORS.border}`, whiteSpace: "nowrap",
  });
  const tdBase = (align) => ({
    padding: "10px 12px", fontSize: 12, color: COLORS.text, textAlign: align,
    borderBottom: `1px solid ${COLORS.border}`, whiteSpace: "nowrap",
  });

  return (
    <div style={{
      background: COLORS.panel, border: `1px solid ${COLORS.border}`, borderRadius: 12,
      padding: 18, marginTop: 16, overflowX: "auto",
    }}>
      <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 4 }}>Portfolio Metrics Summary</div>
      <div style={{ fontSize: 11, color: COLORS.textMuted, marginBottom: 14 }}>
        All projects — color-coded by performance (🟢 good · 🟡 borderline · 🔴 at risk) · <span style={{ color: COLORS.ev }}>Click a row to view project S-curve</span>
      </div>
      <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 640 }}>
        <thead>
          <tr>
            {cols.map((c) => <th key={c.key} style={thStyle(c.align)}>{c.label}</th>)}
          </tr>
        </thead>
        <tbody>
          {DATA.map((p, i) => {
            const m = p.metrics;
            const rowBg = i % 2 === 0 ? "transparent" : "rgba(255,255,255,0.015)";
            return (
              <tr key={p.id}
                style={{ background: rowBg, transition: "background 0.15s", cursor: "pointer" }}
                onClick={() => onSelect(p.id)}
                onMouseEnter={(e) => e.currentTarget.style.background = "rgba(99,179,237,0.07)"}
                onMouseLeave={(e) => e.currentTarget.style.background = rowBg}>
                <td style={{ ...tdBase("left"), color: COLORS.textMuted, fontSize: 11 }}>{p.id}</td>
                <td style={{ ...tdBase("left"), fontWeight: 600 }}>{p.name}</td>
                <td style={{ ...tdBase("left"), color: COLORS.textMuted }}>{p.pm}</td>
                <td style={{ ...tdBase("right") }}>{fmtMoney(p.bac)}</td>
                <td style={{ ...tdBase("right"), background: idxBg(m.cpi), color: cpiColor(m.cpi), fontWeight: 700 }}>{fmtIdx(m.cpi)}</td>
                <td style={{ ...tdBase("right"), background: idxBg(m.spi), color: spiColor(m.spi), fontWeight: 700 }}>{fmtIdx(m.spi)}</td>
                <td style={{ ...tdBase("right"), background: cellBg(m.eac, p.bac), color: eacColor(m.eac, p.bac), fontWeight: 600 }}>{fmtMoney(m.eac)}</td>
                <td style={{ ...tdBase("right") }}>{fmtMoney(m.etc)}</td>
                <td style={{ ...tdBase("center") }}>
                  <span style={{
                    display: "inline-block", padding: "3px 10px", borderRadius: 999, fontSize: 11, fontWeight: 700,
                    background: p.status === "Green" ? "rgba(62,213,152,0.15)" : p.status === "Amber" ? "rgba(242,184,75,0.15)" : "rgba(242,102,107,0.15)",
                    color: p.status === "Green" ? COLORS.green : p.status === "Amber" ? COLORS.amber : COLORS.red,
                    border: `1px solid ${p.status === "Green" ? COLORS.green : p.status === "Amber" ? COLORS.amber : COLORS.red}`,
                    boxShadow: `0 0 8px ${p.status === "Green" ? "rgba(62,213,152,0.2)" : p.status === "Amber" ? "rgba(242,184,75,0.2)" : "rgba(242,102,107,0.2)"}`,
                  }}>{p.status}</span>
                </td>
                <td style={{ ...tdBase("center") }}>
                  <span style={{ fontSize: 16, color: COLORS.textFaint }}>→</span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function ProjectDetail({ project, onBack }) {
  const [page, setPage] = useState("dashboard");

  const chartData = useMemo(() => project.curve.map((c) => ({
    label: c.date, PV: c.pv, EV: c.ev, AC: c.ac,
  })), [project]);

  const bananaData = useMemo(() => project.curve.map((c) => ({
    label: c.date,
    lower: c.early,
    band: Math.max(c.late - c.early, 0),
    "Optimistic bound": c.early,
    "Conservative bound": c.late,
    PV: c.pv,
    AC: c.ac,
  })), [project]);

  const m = project.metrics;
  const asOfLabel = project.curve.find((c) => c.period === project.dataAsOf)?.date;

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
        <button
          onClick={onBack}
          style={{
            display: "flex", alignItems: "center", gap: 6,
            background: COLORS.panel, border: `1px solid ${COLORS.border}`,
            borderRadius: 8, padding: "7px 14px", cursor: "pointer",
            color: COLORS.textMuted, fontSize: 13, fontWeight: 600,
            transition: "all 0.15s",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = COLORS.ev; e.currentTarget.style.color = COLORS.ev; }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = COLORS.border; e.currentTarget.style.color = COLORS.textMuted; }}
        >
          ← Portfolio Overview
        </button>
        <span style={{ fontSize: 12, color: COLORS.textFaint }}>
          / <span style={{ color: COLORS.text }}>{project.name}</span>
        </span>
      </div>

      <div style={{
        background: COLORS.panel, border: `1px solid ${COLORS.border}`, borderRadius: 12,
        padding: 18, marginBottom: 16,
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14, flexWrap: "wrap", gap: 10 }}>
          <div>
            <div style={{ fontSize: 17, fontWeight: 700 }}>{project.name}</div>
            <div style={{ fontSize: 12, color: COLORS.textMuted, marginTop: 2 }}>
              {project.scenario} &nbsp;·&nbsp; PM: {project.pm} &nbsp;·&nbsp; BAC {fmtMoney(project.bac)}
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
            <div style={{
              fontSize: 11, fontWeight: 700, padding: "5px 10px", borderRadius: 999,
              background: project.status === "Green" ? "rgba(62,213,152,0.12)" : project.status === "Amber" ? "rgba(242,184,75,0.12)" : "rgba(242,102,107,0.12)",
              color: project.status === "Green" ? COLORS.green : project.status === "Amber" ? COLORS.amber : COLORS.red,
              border: `1px solid ${project.status === "Green" ? COLORS.green : project.status === "Amber" ? COLORS.amber : COLORS.red}`,
            }}>
              {project.status.toUpperCase()} · AS OF {asOfLabel}
            </div>
            <div style={{ display: "flex", gap: 4, background: COLORS.panel2, border: `1px solid ${COLORS.border}`, borderRadius: 8, padding: 3 }}>
              {[{ id: "dashboard", label: "S-Curve" }, { id: "banana", label: "Banana Curve" }].map((tab) => (
                <button key={tab.id} onClick={() => setPage(tab.id)} style={{
                  border: "none", cursor: "pointer", padding: "6px 13px", borderRadius: 6,
                  fontSize: 12, fontWeight: 600,
                  background: page === tab.id ? COLORS.borderLight : "transparent",
                  color: page === tab.id ? COLORS.text : COLORS.textMuted,
                  transition: "all 0.15s",
                }}>{tab.label}</button>
              ))}
            </div>
          </div>
        </div>

        {page === "dashboard" ? (
          <div style={{ height: 340 }}>
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={chartData} margin={{ top: 6, right: 12, left: 0, bottom: 0 }}>
                <CartesianGrid stroke={COLORS.border} strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="label" tick={{ fill: COLORS.textFaint, fontSize: 11 }} axisLine={{ stroke: COLORS.border }} tickLine={false} />
                <YAxis tickFormatter={fmtMoney} tick={{ fill: COLORS.textFaint, fontSize: 11 }} axisLine={false} tickLine={false} width={56} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: 12, color: COLORS.textMuted }} />
                <Line type="monotone" dataKey="PV" name="PV" stroke={COLORS.pv} strokeWidth={2} strokeDasharray="5 3" dot={false} />
                <Line type="monotone" dataKey="EV" name="EV" stroke={COLORS.ev} strokeWidth={2.5} dot={{ r: 2.5, fill: COLORS.ev }} connectNulls={false} />
                <Line type="monotone" dataKey="AC" name="AC" stroke={COLORS.ac} strokeWidth={2.5} dot={{ r: 2.5, fill: COLORS.ac }} connectNulls={false} />
                <ReferenceLine x={asOfLabel} stroke={COLORS.borderLight} strokeDasharray="2 2" label={{ value: "Today", fill: COLORS.textFaint, fontSize: 10, position: "top" }} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div>
            <div style={{ height: 340 }}>
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={bananaData} margin={{ top: 6, right: 12, left: 0, bottom: 0 }}>
                  <CartesianGrid stroke={COLORS.border} strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="label" tick={{ fill: COLORS.textFaint, fontSize: 11 }} axisLine={{ stroke: COLORS.border }} tickLine={false} />
                  <YAxis tickFormatter={fmtMoney} tick={{ fill: COLORS.textFaint, fontSize: 11 }} axisLine={false} tickLine={false} width={56} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend wrapperStyle={{ fontSize: 12, color: COLORS.textMuted }} />
                  <Area type="monotone" dataKey="lower" stackId="band" stroke="none" fill="transparent" legendType="none" isAnimationActive={false} />
                  <Area type="monotone" dataKey="band" stackId="band" stroke="none" fill={COLORS.bandFill} name="Forecast envelope" isAnimationActive={false} />
                  <Line type="monotone" dataKey="Optimistic bound" stroke={COLORS.band} strokeWidth={1.5} strokeDasharray="2 3" dot={false} />
                  <Line type="monotone" dataKey="Conservative bound" stroke={COLORS.band} strokeWidth={1.5} strokeDasharray="2 3" dot={false} />
                  <Line type="monotone" dataKey="PV" stroke={COLORS.pv} strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="AC" stroke={COLORS.ac} strokeWidth={2.5} dot={{ r: 2.5, fill: COLORS.ac }} connectNulls={false} />
                  <ReferenceLine x={asOfLabel} stroke={COLORS.borderLight} strokeDasharray="2 2" label={{ value: "Today", fill: COLORS.textFaint, fontSize: 10, position: "top" }} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
            <div style={{ fontSize: 12, color: COLORS.textMuted, marginTop: 10, lineHeight: 1.6 }}>
              The <strong style={{ color: COLORS.band }}>banana curve</strong> is the envelope between an early-start cumulative
              spend curve (front-loaded) and a late-start curve (back-loaded) — the range of cash outflow the schedule
              logic allows. PV (baseline) and AC (actual) are overlaid: staying inside the band means the project is
              spending within a schedule-feasible range; a line breaking outside it is a red flag worth digging into.
            </div>
          </div>
        )}
      </div>

      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 12 }}>
        <KpiCard label="SPI" value={fmtIdx(m.spi)} sub={m.spi >= 1 ? "Ahead of schedule" : "Behind schedule"} tone={m.spi >= 1 ? "good" : "bad"} />
        <KpiCard label="CPI" value={fmtIdx(m.cpi)} sub={m.cpi >= 1 ? "Under budget" : "Over budget"} tone={m.cpi >= 1 ? "good" : "bad"} />
        <KpiCard label="SV" value={fmtMoney(m.sv)} sub="Schedule variance" tone={m.sv >= 0 ? "good" : "bad"} />
        <KpiCard label="CV" value={fmtMoney(m.cv)} sub="Cost variance" tone={m.cv >= 0 ? "good" : "bad"} />
      </div>
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        <KpiCard label="EAC — Estimate at Completion" value={fmtMoney(m.eac)} sub={`vs BAC ${fmtMoney(project.bac)}`} tone={m.eac <= project.bac ? "good" : "bad"} />
        <KpiCard label="ETC — Estimate to Complete" value={fmtMoney(m.etc)} sub="Remaining forecast spend" />
        <KpiCard label="VAC — Variance at Completion" value={fmtMoney(m.vac)} sub={m.vac >= 0 ? "Projected surplus" : "Projected overrun"} tone={m.vac >= 0 ? "good" : "bad"} />
        <KpiCard label="% Earned" value={fmtPct(m.pctEarned)} sub={`Planned ${fmtPct(m.pctPlanned)} · Spent ${fmtPct(m.pctSpent)}`} />
      </div>
    </div>
  );
}

export default function EvmDashboard() {
  const [selectedId, setSelectedId] = useState(null);

  const project = useMemo(() => selectedId ? DATA.find((p) => p.id === selectedId) : null, [selectedId]);

  return (
    <div style={{
      background: COLORS.bg, minHeight: "100%", color: COLORS.text,
      fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif", padding: 20,
    }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18, flexWrap: "wrap", gap: 12 }}>
        <div>
          <div style={{ fontSize: 11, letterSpacing: "0.12em", color: COLORS.textFaint, textTransform: "uppercase", marginBottom: 4 }}>
            Portfolio Cashflow &amp; EVM
          </div>
          <div style={{ fontSize: 22, fontWeight: 700 }}>
            {project ? project.name : "Project S-Curve Dashboard"}
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{
            fontSize: 11, padding: "4px 10px", borderRadius: 999,
            background: !project ? "rgba(62,213,152,0.15)" : COLORS.panel,
            color: !project ? COLORS.green : COLORS.textMuted,
            border: `1px solid ${!project ? COLORS.green : COLORS.border}`,
            fontWeight: 600,
          }}>Portfolio</span>
          <span style={{ color: COLORS.textFaint, fontSize: 12 }}>›</span>
          <span style={{
            fontSize: 11, padding: "4px 10px", borderRadius: 999,
            background: project ? "rgba(62,213,152,0.15)" : COLORS.panel,
            color: project ? COLORS.green : COLORS.textFaint,
            border: `1px solid ${project ? COLORS.green : COLORS.border}`,
            fontWeight: 600,
          }}>Project Detail</span>
        </div>
      </div>

      {!project && (
        <div>
          <PortfolioBarChart onSelect={setSelectedId} />
          <PortfolioTable onSelect={setSelectedId} />
        </div>
      )}

      {project && (
        <ProjectDetail project={project} onBack={() => setSelectedId(null)} />
      )}
    </div>
  );
}
