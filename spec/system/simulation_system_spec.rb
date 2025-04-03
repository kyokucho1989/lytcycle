require 'rails_helper'

RSpec.describe 'Widget management', type: :system do
  before do
    driven_by(:rack_test)
    @user = User.create!(name: 'satou2', email: 'satou2@example.com', password: 'password')
  end

  it 'visiting the demo page' do
    visit demo_path
    assert_selector 'h1', text: 'デモページ'
  end

  it 'visiting the index simulation when sign in' do
    sign_in @user
    visit user_simulations_path(@user)
    assert_selector 'h1', text: 'シミュレーション一覧'
  end

  # it "enables me to create widgets" do
  #   visit "/widgets/new"

  #   fill_in "Name", :with => "My Widget"
  #   click_button "Create Widget"

  #   expect(page).to have_text("Widget was successfully created.")
  # end
end
