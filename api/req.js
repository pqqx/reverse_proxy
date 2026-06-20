export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const target = url.searchParams.get("url"); 
    if (!target) {
      return new Response("Please Provide Proxy URL", { status: 400 });
    }

    try {
      const hasBody = !["GET", "HEAD"].includes(request.method);
      const reqHeaders = new Headers(request.headers);
      reqHeaders.delete("host");
      reqHeaders.delete("origin");
      reqHeaders.delete("referer");

      const req = new Request(target, {
        method: request.method,
        headers: reqHeaders,
        body: hasBody ? request.body : null,
        redirect: "manual",
        duplex: "half"
      });

      const response = await fetch(req);
      const resph = new Headers(response.headers);
      resph.delete("content-encoding");
      resph.delete("content-length");
      resph.set("Access-Control-Allow-Origin", "*");
      
      return new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers: resph
      });
    } catch (e) {
      return new Response("Error: " + e.message, { status: 500 });
    }
  }
};
