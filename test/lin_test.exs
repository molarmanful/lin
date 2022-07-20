defmodule LinTest do
  use ExUnit.Case
  doctest Lin

  test "greets the world" do
    assert Lin.hello() == :world
  end
end
