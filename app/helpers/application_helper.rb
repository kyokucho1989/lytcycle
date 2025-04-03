module ApplicationHelper
  def default_meta_tags
    {
      site: 'Lytcycle', reverse: true, charset: 'utf-8',
      description: 'Lytcycle（ライトサイクル）は簡易な生産シミュレータです。簡単な操作で生産ラインのシミュレーションができます。',
      keywords: 'Lytcycle, ライトサイクル, 生産, シミュレーション',
      og: {
        title: :title, type: 'website', site_name: 'Lytcycle', description: :description,
        url: 'https://lytcycle-wild-sun-9576.fly.dev/', local: 'ja-JP'
      },
      twitter: { card: 'summary_large_image' }
    }
  end
end
