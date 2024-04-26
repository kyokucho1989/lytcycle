require "application_system_test_case"

class SimuratesTest < ApplicationSystemTestCase
  setup do
    @simurate = simurates(:one)
  end

  test "visiting the index" do
    visit simurates_url
    assert_selector "h1", text: "Simurates"
  end

  test "should create simurate" do
    visit simurates_url
    click_on "New simurate"

    fill_in "Content", with: @simurate.content
    fill_in "Title", with: @simurate.title
    click_on "Create Simurate"

    assert_text "Simurate was successfully created"
    click_on "Back"
  end

  test "should update Simurate" do
    visit simurate_url(@simurate)
    click_on "Edit this simurate", match: :first

    fill_in "Content", with: @simurate.content
    fill_in "Title", with: @simurate.title
    click_on "Update Simurate"

    assert_text "Simurate was successfully updated"
    click_on "Back"
  end

  test "should destroy Simurate" do
    visit simurate_url(@simurate)
    click_on "Destroy this simurate", match: :first

    assert_text "Simurate was successfully destroyed"
  end
end
