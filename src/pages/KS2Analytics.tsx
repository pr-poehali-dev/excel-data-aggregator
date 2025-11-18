import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import Icon from '@/components/ui/icon';
import { useNavigate } from 'react-router-dom';
import { generateKS2Excel, downloadKS2Excel } from '@/utils/ks2ExcelGenerator';
import { toast } from 'sonner';

const mockSourceFiles = [
  { id: 1, name: 'Объект_1_Апрель.xlsx', rows: 45, date: '15.04.2024', selected: false },
  { id: 2, name: 'Объект_2_Апрель.xlsx', rows: 32, date: '16.04.2024', selected: false },
  { id: 3, name: 'Объект_3_Апрель.xlsx', rows: 28, date: '17.04.2024', selected: false },
  { id: 4, name: 'Объект_1_Май.xlsx', rows: 51, date: '15.05.2024', selected: false }
];

const mockKS2Data = [
  { id: 1, code: '1.1', name: 'Земляные работы', unit: 'м³', quantity: 1250, price: 450, total: 562500, object: 'Объект 1' },
  { id: 2, code: '2.1', name: 'Бетонные работы', unit: 'м³', quantity: 340, price: 3200, total: 1088000, object: 'Объект 1' },
  { id: 3, code: '3.1', name: 'Монтаж конструкций', unit: 'т', quantity: 25, price: 18000, total: 450000, object: 'Объект 2' },
  { id: 4, code: '4.1', name: 'Кровельные работы', unit: 'м²', quantity: 520, price: 850, total: 442000, object: 'Объект 2' },
  { id: 5, code: '5.1', name: 'Отделочные работы', unit: 'м²', quantity: 1200, price: 1200, total: 1440000, object: 'Объект 3' }
];

export default function KS2Analytics() {
  const navigate = useNavigate();
  const [selectedFiles, setSelectedFiles] = useState<number[]>([]);
  const [reportName, setReportName] = useState('КС-2_Сводный_отчет');
  const [reportPeriod, setReportPeriod] = useState('Апрель 2024');
  const [contractor, setContractor] = useState('ООО "СтройМонтаж"');
  const [customer, setCustomer] = useState('ООО "Заказчик"');
  const [contract, setContract] = useState('№ 123/2024 от 01.01.2024');
  const [isGenerating, setIsGenerating] = useState(false);

  const toggleFileSelection = (fileId: number) => {
    setSelectedFiles(prev =>
      prev.includes(fileId) ? prev.filter(id => id !== fileId) : [...prev, fileId]
    );
  };

  const selectAllFiles = () => {
    if (selectedFiles.length === mockSourceFiles.length) {
      setSelectedFiles([]);
    } else {
      setSelectedFiles(mockSourceFiles.map(f => f.id));
    }
  };

  const totalAmount = mockKS2Data.reduce((sum, item) => sum + item.total, 0);

  const handleDownloadKS2 = async () => {
    try {
      setIsGenerating(true);
      toast.info('Генерация Excel файла...');

      const reportData = {
        reportName,
        reportPeriod,
        contractor,
        customer,
        contract,
        items: mockKS2Data
      };

      const blob = await generateKS2Excel(reportData);
      downloadKS2Excel(blob, reportName);

      toast.success('Файл КС-2 успешно создан и загружен!');
    } catch (error) {
      console.error('Ошибка генерации файла:', error);
      toast.error('Ошибка при создании файла КС-2');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        <aside className="w-64 min-h-screen bg-sidebar border-r border-sidebar-border sticky top-0">
          <div className="p-6">
            <div className="flex items-center gap-2 mb-8">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <Icon name="Database" className="text-primary-foreground" size={24} />
              </div>
              <h1 className="text-xl font-bold text-sidebar-foreground">ExcelHub</h1>
            </div>
            
            <nav className="space-y-2">
              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={() => navigate('/')}
              >
                <Icon name="LayoutDashboard" size={20} className="mr-3" />
                Дашборд
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={() => navigate('/')}
              >
                <Icon name="Upload" size={20} className="mr-3" />
                Загрузка файлов
              </Button>
              <Button
                variant="default"
                className="w-full justify-start"
              >
                <Icon name="FileSpreadsheet" size={20} className="mr-3" />
                Аналитика КС-2
              </Button>
              
              <Separator className="my-4" />
              
              <Button variant="ghost" className="w-full justify-start" onClick={() => navigate('/')}>
                <Icon name="ArrowLeft" size={20} className="mr-3" />
                Назад
              </Button>
            </nav>
          </div>
        </aside>

        <main className="flex-1 p-8">
          <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold">Формирование КС-2</h2>
                <p className="text-muted-foreground mt-1">Объединение данных в единую таблицу для аналитики</p>
              </div>
              <Button className="gap-2" size="lg" onClick={handleDownloadKS2} disabled={isGenerating}>
                <Icon name="Download" size={18} />
                {isGenerating ? 'Генерация...' : 'Скачать КС-2'}
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">Всего работ</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{mockKS2Data.length}</div>
                  <p className="text-xs text-muted-foreground mt-1">Из {selectedFiles.length} файлов</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">Общая сумма</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">₽ {totalAmount.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground mt-1">Включая НДС</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">Период</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{reportPeriod}</div>
                  <p className="text-xs text-muted-foreground mt-1">Отчётный месяц</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-1">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Исходные файлы</CardTitle>
                    <Badge variant="secondary">{selectedFiles.length} выбрано</Badge>
                  </div>
                  <CardDescription>Выберите файлы для объединения</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 p-2 hover:bg-muted/50 rounded-md">
                      <Checkbox
                        checked={selectedFiles.length === mockSourceFiles.length}
                        onCheckedChange={selectAllFiles}
                      />
                      <Label className="text-sm font-medium cursor-pointer">Выбрать все</Label>
                    </div>
                    <Separator />
                    {mockSourceFiles.map((file) => (
                      <div key={file.id} className="flex items-start gap-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                        <Checkbox
                          checked={selectedFiles.includes(file.id)}
                          onCheckedChange={() => toggleFileSelection(file.id)}
                          className="mt-1"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <Icon name="FileSpreadsheet" size={16} className="text-primary flex-shrink-0" />
                            <p className="font-medium text-sm truncate">{file.name}</p>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            {file.rows} строк • {file.date}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <Separator className="my-4" />

                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="reportName" className="text-sm">Название отчёта</Label>
                      <Input
                        id="reportName"
                        value={reportName}
                        onChange={(e) => setReportName(e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="reportPeriod" className="text-sm">Период</Label>
                      <Input
                        id="reportPeriod"
                        value={reportPeriod}
                        onChange={(e) => setReportPeriod(e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="contractor" className="text-sm">Подрядчик</Label>
                      <Input
                        id="contractor"
                        value={contractor}
                        onChange={(e) => setContractor(e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="customer" className="text-sm">Заказчик</Label>
                      <Input
                        id="customer"
                        value={customer}
                        onChange={(e) => setCustomer(e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="contract" className="text-sm">Договор</Label>
                      <Input
                        id="contract"
                        value={contract}
                        onChange={(e) => setContract(e.target.value)}
                        className="mt-1"
                      />
                    </div>
                  </div>

                  <Button className="w-full mt-4 gap-2" disabled={selectedFiles.length === 0}>
                    <Icon name="Merge" size={18} />
                    Объединить данные
                  </Button>
                </CardContent>
              </Card>

              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Предварительный просмотр КС-2</CardTitle>
                  <CardDescription>Объединённые данные из выбранных файлов</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="border rounded-lg overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[80px]">Код</TableHead>
                          <TableHead>Наименование работ</TableHead>
                          <TableHead className="w-[80px]">Ед. изм.</TableHead>
                          <TableHead className="w-[100px] text-right">Кол-во</TableHead>
                          <TableHead className="w-[120px] text-right">Цена</TableHead>
                          <TableHead className="w-[140px] text-right">Сумма</TableHead>
                          <TableHead className="w-[120px]">Объект</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {mockKS2Data.map((item) => (
                          <TableRow key={item.id}>
                            <TableCell className="font-medium">{item.code}</TableCell>
                            <TableCell>{item.name}</TableCell>
                            <TableCell>{item.unit}</TableCell>
                            <TableCell className="text-right">{item.quantity.toLocaleString()}</TableCell>
                            <TableCell className="text-right">₽ {item.price.toLocaleString()}</TableCell>
                            <TableCell className="text-right font-medium">₽ {item.total.toLocaleString()}</TableCell>
                            <TableCell>
                              <Badge variant="outline" className="text-xs">{item.object}</Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                        <TableRow className="bg-muted/50 font-bold">
                          <TableCell colSpan={5} className="text-right">ИТОГО:</TableCell>
                          <TableCell className="text-right">₽ {totalAmount.toLocaleString()}</TableCell>
                          <TableCell></TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>

                  <div className="mt-4 flex gap-2">
                    <Button variant="outline" className="gap-2">
                      <Icon name="Eye" size={16} />
                      Полный просмотр
                    </Button>
                    <Button variant="outline" className="gap-2">
                      <Icon name="Settings" size={16} />
                      Настроить колонки
                    </Button>
                    <Button variant="outline" className="gap-2">
                      <Icon name="Filter" size={16} />
                      Фильтры
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}