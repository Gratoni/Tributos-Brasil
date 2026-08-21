import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calculator as CalcIcon, AlertCircle, TrendingUp, Send, ArrowRight } from 'lucide-react';

// Currency formatter
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

// Parse formatted currency back to number
const parseCurrency = (val: string) => {
  const numericStr = val.replace(/[^\d]/g, '');
  if (!numericStr) return 0;
  return Number(numericStr) / 100;
};

// Format numeric input to standard BRL currency string
const formatInputCurrency = (val: string) => {
  const num = parseCurrency(val);
  if (num === 0) return '';
  return new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(num);
};

interface CalculationResults {
  pisCofins: number;
  inss: number;
  ipi: number;
  irpjCsll: number;
  icms: number;
  totalMensal: number;
  totalRetroativo: number;
}

export default function Calculator() {
  const [regime, setRegime] = useState('lucro-real');
  const [faturamento, setFaturamento] = useState('');
  const [folha, setFolha] = useState('');
  const [insumos, setInsumos] = useState('');
  const [icmsMensal, setIcmsMensal] = useState('');

  const [results, setResults] = useState<CalculationResults | null>(null);

  // Lead form state
  const [leadName, setLeadName] = useState('');
  const [leadEmail, setLeadEmail] = useState('');
  const [leadPhone, setLeadPhone] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [leadSuccess, setLeadSuccess] = useState(false);
  const [leadError, setLeadError] = useState('');

  const calculateSavings = () => {
    const valFaturamento = parseCurrency(faturamento);
    const valFolha = parseCurrency(folha);
    const valInsumos = parseCurrency(insumos);
    const valIcms = parseCurrency(icmsMensal);

    // Basic heuristic estimations for tax recovery opportunities
    // PIS/COFINS: Credits on essential inputs, monofasia
    const pisCofins = regime === 'lucro-real' ? valInsumos * 0.0925 * 0.3 : valInsumos * 0.0365 * 0.1;

    // INSS: Optimization of severance pay, FAP/RAT revision
    const inss = valFolha * 0.03; // ~3% average economy opportunity on payroll

    // IPI: Credits on exempt inputs
    const ipi = valInsumos * 0.02;

    // IRPJ/CSLL: JCP, investment subventions
    const irpjCsll = regime === 'lucro-real' ? valFaturamento * 0.015 : valFaturamento * 0.005;

    // ICMS: Export credits, DIFAL, exclusion from PIS/COFINS base
    const icms = valIcms * 0.05;

    const totalMensal = pisCofins + inss + ipi + irpjCsll + icms;
    const totalRetroativo = totalMensal * 60; // 5 years

    setResults({
      pisCofins,
      inss,
      ipi,
      irpjCsll,
      icms,
      totalMensal,
      totalRetroativo
    });
  };

  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadName || !leadEmail) return;

    setSubmitting(true);
    setLeadError('');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: leadName,
          email: leadEmail,
          phone: leadPhone,
          segment: 'Outros',
          message: `SOLICITAÇÃO DE LAUDO GRATUITO VIA CALCULADORA\nRegime: ${regime}\nFaturamento: R$ ${faturamento}\nTotal Mensal Estimado: ${formatCurrency(results?.totalMensal || 0)}\nTotal Retroativo Estimado: ${formatCurrency(results?.totalRetroativo || 0)}`,
        }),
      });

      if (!res.ok) {
        throw new Error('Erro ao enviar solicitação.');
      }
      setLeadSuccess(true);
    } catch (err) {
      setLeadError(err instanceof Error ? err.message : 'Erro ao enviar. Tente novamente.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="calculadora" className="py-24 bg-[#f8fafc] relative overflow-hidden reveal">
      {/* Background elements */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-[#003366]/5 to-transparent pointer-events-none" />
      <div className="absolute -left-40 top-40 w-96 h-96 bg-[#00A86B]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#003366]/10 text-[#003366] text-sm font-bold mb-6">
            <CalcIcon className="w-4 h-4" />
            <span className="tracking-wide uppercase">Simulador Gratuito</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-[#003366] mb-6 font-heading tracking-tight leading-tight">
            Descubra quanto sua empresa pode recuperar em <span className="text-[#00A86B]">Créditos Tributários</span>
          </h2>
          <p className="text-lg text-[#555] leading-relaxed">
            Preencha os dados abaixo para uma estimativa baseada nos pilares de serviços tributários cobertos pela Tributos Brasil.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-10">
          {/* Form */}
          <Card className="shadow-lg border-0 shadow-[#003366]/5">
            <CardHeader className="bg-[#003366] text-white rounded-t-xl">
              <CardTitle className="text-xl flex items-center gap-2">
                Parâmetros da Empresa
              </CardTitle>
              <CardDescription className="text-white/80">
                Insira os valores médios mensais
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-5">
              <div className="space-y-2">
                <Label htmlFor="regime" className="text-[#003366] font-bold">Regime Tributário</Label>
                <Select value={regime} onValueChange={setRegime}>
                  <SelectTrigger id="regime" className="w-full bg-white border-gray-200">
                    <SelectValue placeholder="Selecione o regime" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="lucro-real">Lucro Real</SelectItem>
                    <SelectItem value="lucro-presumido">Lucro Presumido</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="faturamento" className="text-[#003366] font-bold">Faturamento Bruto Médio Mensal (R$)</Label>
                <Input
                  id="faturamento"
                  value={faturamento}
                  onChange={(e) => setFaturamento(formatInputCurrency(e.target.value))}
                  placeholder="0,00"
                  className="bg-white border-gray-200"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="folha" className="text-[#003366] font-bold">Total da Folha de Pagamento Mensal (R$)</Label>
                <Input
                  id="folha"
                  value={folha}
                  onChange={(e) => setFolha(formatInputCurrency(e.target.value))}
                  placeholder="0,00"
                  className="bg-white border-gray-200"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="insumos" className="text-[#003366] font-bold">Custo Médio Mensal com Insumos (R$)</Label>
                <Input
                  id="insumos"
                  value={insumos}
                  onChange={(e) => setInsumos(formatInputCurrency(e.target.value))}
                  placeholder="0,00"
                  className="bg-white border-gray-200"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="icms" className="text-[#003366] font-bold">ICMS Mensal Recolhido/Destacado (R$)</Label>
                <Input
                  id="icms"
                  value={icmsMensal}
                  onChange={(e) => setIcmsMensal(formatInputCurrency(e.target.value))}
                  placeholder="0,00"
                  className="bg-white border-gray-200"
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button
                onClick={calculateSavings}
                className="w-full bg-[#00A86B] hover:bg-[#008f5a] text-white font-bold py-6 text-lg transition-all"
              >
                Simular Economia
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </CardFooter>
          </Card>

          {/* Results */}
          <div className="space-y-6">
            {!results ? (
              <Card className="h-full border-dashed border-2 border-gray-300 bg-transparent flex flex-col items-center justify-center text-center p-10 min-h-[400px]">
                <CalcIcon className="w-16 h-16 text-gray-300 mb-4" />
                <h3 className="text-xl font-bold text-gray-400 mb-2">Aguardando Simulação</h3>
                <p className="text-gray-500">
                  Preencha os dados e clique em "Simular Economia" para ver as estimativas de recuperação.
                </p>
              </Card>
            ) : (
              <div className="space-y-6 fade-in animate-in slide-in-from-bottom-4 duration-500">
                <Card className="border-[#003366]/20 shadow-md">
                  <CardHeader className="bg-[#f0f4f8] rounded-t-xl border-b border-[#003366]/10 pb-4">
                    <CardTitle className="text-[#003366] flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-[#00A86B]" />
                      Estimativa de Oportunidade
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="grid gap-3 text-sm text-[#444]">
                      <div className="flex justify-between border-b pb-2">
                        <span className="font-semibold">PIS e COFINS:</span>
                        <span>{formatCurrency(results.pisCofins)}</span>
                      </div>
                      <div className="flex justify-between border-b pb-2">
                        <span className="font-semibold">Previdenciário (INSS):</span>
                        <span>{formatCurrency(results.inss)}</span>
                      </div>
                      <div className="flex justify-between border-b pb-2">
                        <span className="font-semibold">IPI:</span>
                        <span>{formatCurrency(results.ipi)}</span>
                      </div>
                      <div className="flex justify-between border-b pb-2">
                        <span className="font-semibold">IRPJ & CSLL:</span>
                        <span>{formatCurrency(results.irpjCsll)}</span>
                      </div>
                      <div className="flex justify-between border-b pb-2">
                        <span className="font-semibold">ICMS Estadual:</span>
                        <span>{formatCurrency(results.icms)}</span>
                      </div>
                    </div>

                    <div className="mt-6 p-4 bg-[#003366] rounded-xl text-white">
                      <div className="flex justify-between items-center mb-2 opacity-90">
                        <span className="font-medium">Economia Mensal Estimada:</span>
                        <span className="text-xl font-bold">{formatCurrency(results.totalMensal)}</span>
                      </div>
                      <div className="flex justify-between items-center pt-2 border-t border-white/20">
                        <span className="font-bold text-lg text-[#00A86B]">Potencial Retroativo (5 anos):</span>
                        <span className="text-2xl font-black text-[#00A86B]">{formatCurrency(results.totalRetroativo)}</span>
                      </div>
                    </div>
                    <p className="text-xs text-gray-400 mt-4 text-center">
                      * Esta é apenas uma estimativa algorítmica. O valor real depende de uma análise detalhada.
                    </p>
                  </CardContent>
                </Card>

                {/* Lead Capture */}
                <Card className="border-[#00A86B] border-2 shadow-lg relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1 bg-[#00A86B]" />
                  <CardHeader>
                    <CardTitle className="text-xl text-[#003366]">Solicite um Laudo Técnico Gratuito</CardTitle>
                    <CardDescription>Nossos especialistas farão uma auditoria detalhada sem compromisso.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {leadSuccess ? (
                      <div className="p-4 bg-green-50 text-green-800 rounded-lg border border-green-200 text-center">
                        <p className="font-bold mb-1">Solicitação enviada com sucesso!</p>
                        <p className="text-sm">Em breve um especialista entrará em contato.</p>
                      </div>
                    ) : (
                      <form onSubmit={handleLeadSubmit} className="space-y-4">
                        {leadError && (
                          <div className="p-3 bg-red-50 text-red-700 rounded-md flex items-center gap-2 text-sm">
                            <AlertCircle className="w-4 h-4" /> {leadError}
                          </div>
                        )}
                        <div className="space-y-2">
                          <Label htmlFor="leadName">Nome</Label>
                          <Input
                            id="leadName"
                            required
                            value={leadName}
                            onChange={(e) => setLeadName(e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="leadEmail">E-mail Corporativo</Label>
                          <Input
                            id="leadEmail"
                            type="email"
                            required
                            value={leadEmail}
                            onChange={(e) => setLeadEmail(e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="leadPhone">Telefone / WhatsApp</Label>
                          <Input
                            id="leadPhone"
                            value={leadPhone}
                            onChange={(e) => setLeadPhone(e.target.value)}
                          />
                        </div>
                        <Button type="submit" disabled={submitting} className="w-full bg-[#003366] hover:bg-[#002244]">
                          {submitting ? 'Enviando...' : (
                            <>
                              <Send className="w-4 h-4 mr-2" />
                              Quero meu Laudo Gratuito
                            </>
                          )}
                        </Button>
                      </form>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
