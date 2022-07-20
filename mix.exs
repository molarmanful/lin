defmodule Lin.MixProject do
  use Mix.Project

  def project do
    [
      app: :lin,
      version: "0.0.0",
      elixir: "~> 1.13",
      start_permanent: Mix.env() == :prod,
      escript: escript(),
      deps: deps()
    ]
  end

  def application do
    [
      extra_applications: [:logger]
    ]
  end

  defp deps do
    [
      {:combinatorics, "~> 0.1.0"}
    ]
  end

  defp escript do
    [
      main_module: Lin.CLI
    ]
  end
end
