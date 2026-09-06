# MuniSoft Marketing Dashboard

Python dashboard built with Streamlit, Pandas and Supabase.

## Run locally

```bash
pip install -r requirements.txt
export SUPABASE_URL="your-project-url"
export SUPABASE_SERVICE_ROLE_KEY="server-only-key"
streamlit run app.py
```

Never expose the service role key in browser code.
