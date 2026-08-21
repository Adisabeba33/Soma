import { describe, it } from "node:test";
import { strict as assert } from "node:assert";

import { assertReadableUrl, UnsafeUrlError } from "../src/lib/menu/url-guard";

describe("assertReadableUrl", () => {
  it("accepts an ordinary menu link, filters and all", () => {
    const url = assertReadableUrl(
      "https://dutchie.com/stores/elivate-ny/products/flower?weight=1oz",
    );
    assert.equal(url.hostname, "dutchie.com");
    assert.equal(url.searchParams.get("weight"), "1oz");
  });

  it("accepts a menu embedded on the retailer's own domain", () => {
    const url = assertReadableUrl("http://example-dispensary.com/menu?dtche%5Bpath%5D=flower");
    assert.equal(url.protocol, "http:");
  });

  function rejection(raw: string): string {
    try {
      assertReadableUrl(raw);
    } catch (error) {
      assert.ok(error instanceof UnsafeUrlError);
      return error.rejection;
    }
    throw new Error(`${raw} was accepted and should not have been`);
  }

  it("refuses anything that is not a web link", () => {
    assert.equal(rejection(""), "not-a-url");
    assert.equal(rejection("not a link at all"), "not-a-url");
    assert.equal(rejection("file:///etc/passwd"), "bad-scheme");
    assert.equal(rejection("javascript:alert(1)"), "bad-scheme");
    assert.equal(rejection("data:text/html,<h1>hi"), "bad-scheme");
    assert.equal(rejection(`https://example.com/${"x".repeat(2100)}`), "too-long");
  });

  it("refuses a link carrying someone's sign-in", () => {
    assert.equal(rejection("https://user:secret@example.com/menu"), "has-credentials");
  });

  // The renderer has no route to any of these, but saying so here turns a
  // timeout into an explanation.
  it("refuses addresses that are not a public menu", () => {
    for (const raw of [
      "http://localhost:3000/admin",
      "http://LOCALHOST/menu",
      "http://something.localhost/menu",
      "http://127.0.0.1/menu",
      "http://0.0.0.0/menu",
      "http://10.1.2.3/menu",
      "http://172.16.0.1/menu",
      "http://172.31.255.254/menu",
      "http://192.168.1.1/menu",
      "http://169.254.169.254/latest/meta-data",
      "http://100.64.0.1/menu",
      "http://metadata.google.internal/",
      "http://vault.internal/menu",
      "http://[::1]/menu",
      "http://[fe80::1]/menu",
      "http://[fd00::1]/menu",
      "http://[::ffff:127.0.0.1]/menu",
      // The form URL actually stores that one as.
      "http://[::ffff:7f00:1]/menu",
      "http://[::ffff:a01:203]/menu",
      "http://[::ffff:c0a8:1]/menu",
    ]) {
      assert.equal(rejection(raw), "local-address", raw);
    }
  });

  it("does not mistake a public address for a private one", () => {
    for (const raw of [
      "https://172.32.0.1/menu",
      "https://172.15.255.255/menu",
      "https://192.169.0.1/menu",
      "https://100.63.255.255/menu",
      "https://8.8.8.8/menu",
      "https://[::ffff:808:808]/menu",
      "https://internal-menu.example.com/menu",
    ]) {
      assert.doesNotThrow(() => assertReadableUrl(raw), raw);
    }
  });
});
