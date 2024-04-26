require "test_helper"

class SimuratesControllerTest < ActionDispatch::IntegrationTest
  setup do
    @simurate = simurates(:one)
  end

  test "should get index" do
    get simurates_url
    assert_response :success
  end

  test "should get new" do
    get new_simurate_url
    assert_response :success
  end

  test "should create simurate" do
    assert_difference("Simurate.count") do
      post simurates_url, params: { simurate: { content: @simurate.content, title: @simurate.title } }
    end

    assert_redirected_to simurate_url(Simurate.last)
  end

  test "should show simurate" do
    get simurate_url(@simurate)
    assert_response :success
  end

  test "should get edit" do
    get edit_simurate_url(@simurate)
    assert_response :success
  end

  test "should update simurate" do
    patch simurate_url(@simurate), params: { simurate: { content: @simurate.content, title: @simurate.title } }
    assert_redirected_to simurate_url(@simurate)
  end

  test "should destroy simurate" do
    assert_difference("Simurate.count", -1) do
      delete simurate_url(@simurate)
    end

    assert_redirected_to simurates_url
  end
end
