import { Bot, BrainCircuit, CheckCircle2, HelpCircle, MessageSquare, Route, Search, Sparkles } from 'lucide-react';
import { useMemo, useState } from 'react';
import ResourceIconList from '../components/ResourceIconList';
import { calculateCityScore } from '../utils/calculateCityScore';
import { answerKnowledgeQuestion, sampleQuestions } from '../utils/knowledgeQa';

export default function KnowledgeQaPage() {
  const [question, setQuestion] = useState('哪个城市最适合科技胜利？');
  const [submittedQuestion, setSubmittedQuestion] = useState('哪个城市最适合科技胜利？');
  const result = useMemo(() => answerKnowledgeQuestion(submittedQuestion), [submittedQuestion]);

  const ask = (value = question) => {
    setQuestion(value);
    setSubmittedQuestion(value);
  };

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <header className="mb-6 rounded-xl border border-cyan-500/20 bg-slate-900 p-6 shadow-lg">
        <div className="grid gap-6 lg:grid-cols-[1fr_320px] lg:items-end">
          <div>
            <div className="text-xs uppercase tracking-[0.32em] text-cyan-300">Knowledge Graph QA</div>
            <h1 className="mt-2 text-4xl font-bold text-white">本地知识图谱问答</h1>
            <p className="mt-3 max-w-3xl text-slate-400">
              基于本地城市数据和知识图谱关系进行规则问答，不依赖联网或大模型。回答会附带“图谱路径证据”，说明推荐是从哪些节点和关系推导出来的。
            </p>
          </div>
          <div className="rounded-xl border border-green-400/30 bg-green-400/10 p-5">
            <div className="flex items-center gap-3 text-green-100">
              <BrainCircuit className="h-8 w-8" />
              <div>
                <div className="text-sm text-slate-400">问答类型</div>
                <div className="text-2xl font-bold">本地规则推理</div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <section className="grid gap-6 lg:grid-cols-[380px_1fr]">
        <aside className="space-y-6">
          <section className="rounded-xl border border-cyan-500/20 bg-slate-900 p-5 shadow-lg">
            <h2 className="flex items-center gap-2 text-xl font-bold text-white">
              <MessageSquare className="h-5 w-5 text-cyan-300" />
              输入问题
            </h2>
            <textarea
              value={question}
              onChange={(event) => setQuestion(event.target.value)}
              rows={4}
              className="mt-4 w-full resize-none rounded-xl border border-slate-700 bg-gray-900 px-4 py-3 text-sm leading-6 text-white outline-none placeholder:text-slate-500 focus:border-cyan-400"
              placeholder="例如：哪个城市适合建学院？"
            />
            <button
              type="button"
              onClick={() => ask()}
              className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-cyan-300 px-4 py-3 font-bold text-slate-950 transition-all hover:scale-[1.02] hover:bg-cyan-200"
            >
              <Search className="h-4 w-4" />
              基于图谱回答
            </button>
          </section>

          <section className="rounded-xl border border-cyan-500/20 bg-slate-900 p-5 shadow-lg">
            <h2 className="flex items-center gap-2 text-lg font-bold text-white">
              <HelpCircle className="h-5 w-5 text-cyan-300" />
              示例问题
            </h2>
            <div className="mt-4 grid gap-2">
              {sampleQuestions.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => ask(item)}
                  className="rounded-lg border border-slate-700 bg-gray-900 px-3 py-2 text-left text-sm text-slate-300 transition-all hover:scale-[1.01] hover:border-cyan-400/50 hover:text-white"
                >
                  {item}
                </button>
              ))}
            </div>
          </section>
        </aside>

        <section className="space-y-6">
          <section className="rounded-xl border border-cyan-500/20 bg-slate-900 p-6 shadow-lg">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h2 className="flex items-center gap-2 text-xl font-bold text-white">
                  <Bot className="h-5 w-5 text-cyan-300" />
                  问答结果
                </h2>
                <div className="mt-2 text-sm text-slate-500">问题：{result.question}</div>
              </div>
              <div className="rounded-lg border border-green-400/25 bg-green-400/10 px-3 py-2 text-sm font-bold text-green-100">置信度：{result.confidence}</div>
            </div>
            <p className="mt-5 rounded-xl border border-cyan-400/20 bg-cyan-400/10 p-5 text-lg leading-8 text-cyan-50">{result.answer}</p>
          </section>

          <section className="rounded-xl border border-cyan-500/20 bg-slate-900 p-6 shadow-lg">
            <h2 className="flex items-center gap-2 text-xl font-bold text-white">
              <Route className="h-5 w-5 text-amber-300" />
              图谱路径证据
            </h2>
            <div className="mt-4 grid gap-3">
              {result.evidence.map((item) => (
                <div key={item.path} className="rounded-xl border border-amber-400/20 bg-amber-400/10 p-4">
                  <div className="flex items-center gap-2 font-bold text-amber-100">
                    <CheckCircle2 className="h-4 w-4" />
                    {item.path}
                  </div>
                  <p className="mt-2 text-sm leading-6 text-amber-50/80">{item.explanation}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-xl border border-cyan-500/20 bg-slate-900 p-6 shadow-lg">
            <h2 className="flex items-center gap-2 text-xl font-bold text-white">
              <Sparkles className="h-5 w-5 text-green-300" />
              相关城市
            </h2>
            <div className="mt-4 grid gap-4 lg:grid-cols-2">
              {result.relatedCities.map((city) => {
                const score = calculateCityScore(city);
                return (
                  <article key={city.id} className="rounded-xl border border-slate-700 bg-gray-900 p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-lg font-bold text-white">{city.name}</h3>
                        <p className="mt-1 text-sm leading-6 text-slate-400">{city.description}</p>
                      </div>
                      <div className="rounded-lg border border-green-400/25 bg-green-400/10 px-3 py-2 text-center">
                        <div className="text-xs text-slate-400">评分</div>
                        <div className="text-2xl font-bold text-green-300">{score.total}</div>
                      </div>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {city.tags.slice(0, 5).map((tag) => (
                        <span key={tag} className="tag-chip">{tag}</span>
                      ))}
                    </div>
                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
                      <ResourceIconList title="奢侈资源" resources={city.luxuryResources} />
                      <ResourceIconList title="战略资源" resources={city.strategicResources} />
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        </section>
      </section>
    </main>
  );
}
