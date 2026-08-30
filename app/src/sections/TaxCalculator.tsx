import { useMemo, useState } from 'react';
import { Calculator, ShieldCheck, Percent, Info } from 'lucide-react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const DEFAULTS = {
  pis: 1.65,
  cofins: 7.6,
  ipi: 5,
  icms: 18,
  inss: 11,
  csll: 9,
  irpj: 15,
};

const MONEY = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

function parseNumber(value: string) {
  const normalized = value.replace(/\./g, '').replace(',', '.');
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : 0;
}

function formatPercent(value: number) {
  return `${value.toFixed(2).replace('.', ',')}%`;
}

export default function TaxCalculator() {
  const [revenue, setRevenue] = useState('1000000');
  const [rates, setRates] = useState(DEFAULTS);

  const totalRevenue = parseNumber(revenue);

  const result = useMemo(() => {
    const base = totalRevenue > 0 ? totalRevenue : 0;
    const taxes = {
      pis: base * (rates.pis / 100),
      cofins: base * (rates.cofins / 100),
      ipi: base * (rates.ipi / 100),
      icms: base * (rates.icms / 100),
      inss: base * (rates.inss / 100),
      csll: base * (rates.csll / 100),
      irpj: base * (rates.irpj / 100),
    };
    const total = Object.values(taxes).reduce((sum, value) => sum + value, 0);
    return { taxes, total, base };
  }, [rates, totalRevenue]);

  const items = [
    { key: 'pis', label: 'PIS', rate: rates.pis },
    { key: 'cofins', label: 'COFINS', rate: rates.cofins },
    { key: 'ipi', label: 'IPI', rate: rates.ipi },
    { key: 'icms', label: 'ICMS', rate: rates.icms },
    { key: 'inss', label: 'INSS', rate: rates.inss },
    { key: 'csll', label: 'CSLL', rate: rates.csll },
    { key: 'irpj', label: 'IRPJ', rate: rates.irpj },
  ] as const;
  type TaxKey = (typeof items)[number]['key'];

  return (
    <section id="calculadora-tributaria" className="py-24 lg:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <span className="section-label justify-center">CALCULADORA TRIBUTÁRIA</span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#003366] font-heading mt-3">
            Estime PIS, COFINS, IPI, ICMS, INSS, CSLL e IRPJ
          </h2>
          <p className="text-lg text-[#666] mt-4">
            Simule rapidamente uma carga tributária aproximada com base na receita informada.
          </p>
        </div>

        <div className="grid lg:grid-cols-[1.05fr_0.95fr] gap-8 items-start">
          <Card className="shadow-card border-[#e8edf3]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-[#003366] text-2xl font-black font-heading">
                <Calculator className="w-5 h-5 text-[#00A86B]" />
                Dados da simulação
              </CardTitle>
              <CardDescription>
                Ajuste a receita e as alíquotas para ver o impacto estimado.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="revenue">Receita base mensal (R$)</Label>
                <Input
                  id="revenue"
                  inputMode="decimal"
                  value={revenue}
                  onChange={(e) => setRevenue(e.target.value)}
                  placeholder="1000000"
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                {items.map((item) => (
                  <div key={item.key} className="space-y-2">
                    <Label htmlFor={item.key}>{item.label}</Label>
                    <Input
                      id={item.key}
                      inputMode="decimal"
                      value={String(item.rate).replace('.', ',')}
                      onChange={(e) =>
                        setRates((current) => ({
                          ...current,
                          [item.key]: parseNumber(e.target.value),
                        } as typeof current))
                      }
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-navy-md border-[#003366]/10 bg-[#f4f6f9]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-[#003366] text-2xl font-black font-heading">
                <ShieldCheck className="w-5 h-5 text-[#00A86B]" />
                Resultado estimado
              </CardTitle>
              <CardDescription>
                Valores calculados sobre a base informada.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-2xl bg-white p-5 shadow-card">
                <div className="flex items-center justify-between text-sm text-[#666]">
                  <span>Base tributável</span>
                  <span className="font-semibold text-[#003366]">{MONEY.format(result.base)}</span>
                </div>
                <div className="mt-3 flex items-end justify-between gap-4">
                  <div>
                    <div className="text-xs uppercase tracking-[0.2em] text-[#666]">Total estimado</div>
                    <div className="text-3xl font-black font-heading text-[#00A86B]">{MONEY.format(result.total)}</div>
                  </div>
                  <div className="text-right text-sm text-[#666]">
                    <div className="font-semibold text-[#003366]">Carga efetiva</div>
                    <div>{formatPercent((result.total / (result.base || 1)) * 100)}</div>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                {items.map((item) => (
                  <div key={item.key} className="flex items-center justify-between rounded-xl bg-white px-4 py-3 shadow-sm">
                    <div>
                      <div className="font-semibold text-[#003366]">{item.label}</div>
                      <div className="text-xs text-[#666] flex items-center gap-1">
                        <Percent className="w-3 h-3" />
                        {formatPercent(item.rate)}
                      </div>
                    </div>
                    <div className="font-bold text-[#003366]">{MONEY.format(result.taxes[item.key as TaxKey])}</div>
                  </div>
                ))}
              </div>

              <div className="flex items-start gap-3 rounded-xl border border-[#003366]/10 bg-white p-4 text-sm text-[#666]">
                <Info className="w-4 h-4 text-[#00A86B] mt-0.5 flex-shrink-0" />
                Simulação simplificada para fins comerciais. A apuração real depende do regime tributário, da natureza da operação e de regras específicas.
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
