export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const target = url.searchParams.get("url"); 
    if (!target) {
      return new Response("Please Provide Proxy URL", { status: 400 });
    }

    try {
      const req = new Request(target, {
        method: request.method,
        headers: request.headers,
        body: request.body,
        redirect: "manual"
      });

      const response = await fetch(req);
      const resp = new Response(response.body, response);
      resp.headers.set("Access-Control-Allow-Origin", "*");
      
      return resp;
    } catch (e) {
      return new Response("Error: " + e.message, { status: 500 });
    }
  }
};
