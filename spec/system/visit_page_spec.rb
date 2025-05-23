require 'rails_helper'

RSpec.describe 'VisitSimulationPage', type: :system do
  before do
    driven_by(:rack_test)
    @confirmed_user = User.create!(name: 'satou2', email: 'satou2@example.com', password: 'password',
                                   confirmed_at: DateTime.now)
  end

  it 'visiting the index simulation when sign in' do
    sign_in @confirmed_user
    visit user_simulations_path(@confirmed_user)
    assert_selector 'h1', text: 'シミュレーション一覧'
  end

  it 'redirect index simulation when sign in' do
    sign_in @confirmed_user
    visit welcome_path(@confirmed_user)
    assert_selector 'h1', text: 'シミュレーション一覧'
  end
end

RSpec.describe 'VisitOtherPage', type: :system do
  before do
    driven_by(:rack_test)
    @confirmed_user = User.create!(name: 'satou2', email: 'satou2@example.com', password: 'password',
                                   confirmed_at: DateTime.now)
  end

  it 'visiting the demo page' do
    visit new_demo_path
    assert_selector 'h1', text: 'デモ'
  end

  it 'visiting the privacy policy page' do
    visit privacy_path
    assert_selector 'h1', text: 'プライバシーポリシー'
  end

  it 'visiting the term page' do
    visit term_path
    assert_selector 'h1', text: '利用規約'
  end
end
