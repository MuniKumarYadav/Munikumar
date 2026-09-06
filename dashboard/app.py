import os
import pandas as pd
import streamlit as st
from supabase import create_client

st.set_page_config(page_title="MuniSoft Marketing Dashboard", page_icon="📈", layout="wide")

@st.cache_resource
def db():
    url = os.environ.get("SUPABASE_URL")
    key = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")
    if not url or not key:
        return None
    return create_client(url, key)

st.title("📈 MuniSoft Digital Marketing Dashboard")
st.caption("Leads, requirements and marketing intelligence")

client = db()
if client is None:
    st.error("Configure SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY to load live data.")
    st.stop()

try:
    rows = client.table("leads").select("*").order("created_at", desc=True).execute().data
except Exception as exc:
    st.error(f"Unable to load leads: {exc}")
    st.stop()

df = pd.DataFrame(rows)
if df.empty:
    st.info("No leads yet. MuniBot submissions and website enquiries will appear here.")
    st.stop()

total = len(df)
new = int((df["status"] == "new").sum()) if "status" in df else 0
qualified = int((df["status"] == "qualified").sum()) if "status" in df else 0
won = int((df["status"] == "won").sum()) if "status" in df else 0

a,b,c,d = st.columns(4)
a.metric("Total Leads", total)
b.metric("New Leads", new)
c.metric("Qualified", qualified)
d.metric("Won", won)

st.divider()
left, right = st.columns([2,1])

with left:
    st.subheader("Lead Pipeline")
    pipeline = df["status"].value_counts().rename_axis("Status").reset_index(name="Leads")
    st.bar_chart(pipeline.set_index("Status"))

with right:
    st.subheader("Top Sources")
    if "source" in df:
        sources = df["source"].fillna("unknown").value_counts().rename_axis("Source").reset_index(name="Leads")
        st.dataframe(sources, use_container_width=True, hide_index=True)

st.subheader("Lead Management")
cols = [x for x in ["created_at","name","email","company","phone","service_interest","source","status"] if x in df.columns]
st.dataframe(df[cols], use_container_width=True, hide_index=True)

st.subheader("Update Lead Status")
lead_names = {f"{r.get('name','Unknown')} — {r.get('email','')}": r.get("id") for r in rows}
selected = st.selectbox("Select lead", list(lead_names))
new_status = st.selectbox("Status", ["new","contacted","qualified","proposal","won","lost"])
if st.button("Save status"):
    client.table("leads").update({"status": new_status}).eq("id", lead_names[selected]).execute()
    st.success("Lead status updated. Refresh the dashboard to see the latest pipeline.")
