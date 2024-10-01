require "application_system_test_case"

class SimulationsTest < ApplicationSystemTestCase
  test "visiting the demo page" do
    visit demo_path
    assert_selector "h1", text: "demo Simulation"
  end

  test "visiting the index simulation when sign in" do
    user = users(:user1)
    sign_in user
    visit user_simulations_url(user)
    assert_selector "h1", text: "Simulation一覧"
  end
end
