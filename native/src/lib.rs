use neon::prelude::*;
use scanpw::scanpw;
use is_prime::is_prime;

fn rline(mut cx: FunctionContext) -> JsResult<JsString> {
  Ok(cx.string(std::io::stdin().lines().next().unwrap().unwrap()))
}

fn rline_pw(mut cx: FunctionContext) -> JsResult<JsString> {
  Ok(cx.string(scanpw!(None)))
}

fn isprime(mut cx: FunctionContext) -> JsResult<JsBoolean> {
  let n = cx.argument::<JsString>(0)?.value(&mut cx) as String;

  Ok(cx.boolean(is_prime(&n)))
}

#[neon::main]
fn main(mut cx: ModuleContext) -> NeonResult<()> {
  cx.export_function("rline", rline)?;
  cx.export_function("rline_pw", rline_pw)?;
  cx.export_function("isprime", isprime)?;
  Ok(())
}
