import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import Icon from '@/components/ui/icon';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useNavigate } from 'react-router-dom';

const mockChartData = [
  { name: 'Янв', uploads: 12, merges: 8 },
  { name: 'Фев', uploads: 19, merges: 15 },
  { name: 'Мар', uploads: 15, merges: 12 },
  { name: 'Апр', uploads: 25, merges: 20 },
  { name: 'Май', uploads: 32, merges: 28 },
  { name: 'Июн', uploads: 28, merges: 24 }
];

const mockFiles = [
  { id: 1, name: 'Отчет_Q1_2024.xlsx', size: '2.4 MB', uploaded: '15.05.2024', user: 'Анна К.', status: 'processed' },
  { id: 2, name: 'Данные_продажи.xlsx', size: '1.8 MB', uploaded: '14.05.2024', user: 'Иван П.', status: 'processing' },
  { id: 3, name: 'Инвентаризация.xlsx', size: '3.2 MB', uploaded: '13.05.2024', user: 'Мария С.', status: 'processed' },
  { id: 4, name: 'Бюджет_2024.xlsx', size: '1.5 MB', uploaded: '12.05.2024', user: 'Петр Д.', status: 'error' }
];

const mockUsers = [
  { id: 1, name: 'Анна Ковалева', email: 'anna@company.com', role: 'admin', active: true, initials: 'АК' },
  { id: 2, name: 'Иван Петров', email: 'ivan@company.com', role: 'editor', active: true, initials: 'ИП' },
  { id: 3, name: 'Мария Сидорова', email: 'maria@company.com', role: 'viewer', active: true, initials: 'МС' },
  { id: 4, name: 'Петр Дмитриев', email: 'petr@company.com', role: 'editor', active: false, initials: 'ПД' }
];

export default function Index() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-primary text-primary-foreground';
      case 'editor': return 'bg-secondary text-secondary-foreground';
      case 'viewer': return 'bg-muted text-muted-foreground';
      default: return 'bg-muted';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'processed': return <Badge className="bg-green-500 text-white">Обработан</Badge>;
      case 'processing': return <Badge className="bg-blue-500 text-white">Обработка</Badge>;
      case 'error': return <Badge variant="destructive">Ошибка</Badge>;
      default: return <Badge>Неизвестно</Badge>;
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
                variant={activeTab === 'dashboard' ? 'default' : 'ghost'}
                className="w-full justify-start"
                onClick={() => setActiveTab('dashboard')}
              >
                <Icon name="LayoutDashboard" size={20} className="mr-3" />
                Дашборд
              </Button>
              <Button
                variant={activeTab === 'upload' ? 'default' : 'ghost'}
                className="w-full justify-start"
                onClick={() => setActiveTab('upload')}
              >
                <Icon name="Upload" size={20} className="mr-3" />
                Загрузка файлов
              </Button>
              <Button
                variant={activeTab === 'tables' ? 'default' : 'ghost'}
                className="w-full justify-start"
                onClick={() => setActiveTab('tables')}
              >
                <Icon name="Table" size={20} className="mr-3" />
                Таблицы
              </Button>
              <Button
                variant={activeTab === 'users' ? 'default' : 'ghost'}
                className="w-full justify-start"
                onClick={() => setActiveTab('users')}
              >
                <Icon name="Users" size={20} className="mr-3" />
                Пользователи
              </Button>
              
              <Separator className="my-4" />
              
              <Button variant="ghost" className="w-full justify-start" onClick={() => navigate('/ks2-analytics')}>
                <Icon name="FileSpreadsheet" size={20} className="mr-3" />
                Аналитика КС-2
              </Button>
              <Button variant="ghost" className="w-full justify-start">
                <Icon name="Settings" size={20} className="mr-3" />
                Настройки
              </Button>
              <Button variant="ghost" className="w-full justify-start">
                <Icon name="History" size={20} className="mr-3" />
                История
              </Button>
            </nav>
          </div>
        </aside>

        <main className="flex-1 p-8">
          {activeTab === 'dashboard' && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-bold">Добро пожаловать!</h2>
                  <p className="text-muted-foreground mt-1">Обзор данных и статистики</p>
                </div>
                <Button className="gap-2">
                  <Icon name="Download" size={18} />
                  Экспорт
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Всего файлов</CardTitle>
                    <Icon name="FileSpreadsheet" className="text-primary" size={20} />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">127</div>
                    <p className="text-xs text-muted-foreground mt-1">+12% от прошлого месяца</p>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Объединено</CardTitle>
                    <Icon name="Merge" className="text-secondary" size={20} />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">94</div>
                    <p className="text-xs text-muted-foreground mt-1">74% успешность</p>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Пользователи</CardTitle>
                    <Icon name="Users" className="text-accent" size={20} />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">24</div>
                    <p className="text-xs text-muted-foreground mt-1">18 активны сейчас</p>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Место на диске</CardTitle>
                    <Icon name="HardDrive" className="text-muted-foreground" size={20} />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">68%</div>
                    <Progress value={68} className="mt-2" />
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Статистика загрузок</CardTitle>
                    <CardDescription>Количество загруженных и объединенных файлов</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={mockChartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
                        <YAxis stroke="hsl(var(--muted-foreground))" />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'hsl(var(--card))',
                            border: '1px solid hsl(var(--border))',
                            borderRadius: '8px'
                          }}
                        />
                        <Line type="monotone" dataKey="uploads" stroke="hsl(var(--primary))" strokeWidth={2} />
                        <Line type="monotone" dataKey="merges" stroke="hsl(var(--secondary))" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Активность по месяцам</CardTitle>
                    <CardDescription>Общее количество операций</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={mockChartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
                        <YAxis stroke="hsl(var(--muted-foreground))" />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'hsl(var(--card))',
                            border: '1px solid hsl(var(--border))',
                            borderRadius: '8px'
                          }}
                        />
                        <Bar dataKey="uploads" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Последние файлы</CardTitle>
                  <CardDescription>Недавно загруженные документы</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Файл</TableHead>
                        <TableHead>Размер</TableHead>
                        <TableHead>Загрузил</TableHead>
                        <TableHead>Дата</TableHead>
                        <TableHead>Статус</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockFiles.map((file) => (
                        <TableRow key={file.id}>
                          <TableCell className="font-medium flex items-center gap-2">
                            <Icon name="FileSpreadsheet" className="text-green-600" size={20} />
                            {file.name}
                          </TableCell>
                          <TableCell>{file.size}</TableCell>
                          <TableCell>{file.user}</TableCell>
                          <TableCell>{file.uploaded}</TableCell>
                          <TableCell>{getStatusBadge(file.status)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'upload' && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <h2 className="text-3xl font-bold">Загрузка файлов</h2>
                <p className="text-muted-foreground mt-1">Загрузите Excel файлы для обработки</p>
              </div>

              <Card>
                <CardContent className="pt-6">
                  <div
                    className={`border-2 border-dashed rounded-lg p-12 text-center transition-all ${
                      dragActive ? 'border-primary bg-primary/5' : 'border-border'
                    }`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                  >
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                        <Icon name="Upload" className="text-primary" size={32} />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold mb-1">Перетащите файлы сюда</h3>
                        <p className="text-sm text-muted-foreground">или выберите файлы вручную</p>
                      </div>
                      <Button className="mt-2">
                        <Icon name="FolderOpen" size={18} className="mr-2" />
                        Выбрать файлы
                      </Button>
                      <p className="text-xs text-muted-foreground mt-2">
                        Поддерживаются форматы: .xlsx, .xls, .csv (макс. 10 MB)
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Загруженные файлы</CardTitle>
                  <CardDescription>Список всех загруженных файлов</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockFiles.map((file) => (
                      <div key={file.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                            <Icon name="FileSpreadsheet" className="text-green-600" size={20} />
                          </div>
                          <div>
                            <p className="font-medium">{file.name}</p>
                            <p className="text-sm text-muted-foreground">{file.size} • {file.uploaded}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          {getStatusBadge(file.status)}
                          <Button variant="ghost" size="sm">
                            <Icon name="Download" size={18} />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Icon name="MoreVertical" size={18} />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'tables' && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-bold">Таблицы данных</h2>
                  <p className="text-muted-foreground mt-1">Просмотр и объединение данных</p>
                </div>
                <Button className="gap-2">
                  <Icon name="Merge" size={18} />
                  Объединить таблицы
                </Button>
              </div>

              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Разделы данных</CardTitle>
                    <Input placeholder="Поиск..." className="w-64" />
                  </div>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="sales">
                    <TabsList className="grid w-full grid-cols-4">
                      <TabsTrigger value="sales">Продажи</TabsTrigger>
                      <TabsTrigger value="inventory">Инвентарь</TabsTrigger>
                      <TabsTrigger value="budget">Бюджет</TabsTrigger>
                      <TabsTrigger value="reports">Отчеты</TabsTrigger>
                    </TabsList>
                    <TabsContent value="sales" className="mt-4">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>ID</TableHead>
                            <TableHead>Товар</TableHead>
                            <TableHead>Количество</TableHead>
                            <TableHead>Сумма</TableHead>
                            <TableHead>Дата</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          <TableRow>
                            <TableCell>#001</TableCell>
                            <TableCell>Ноутбук Dell XPS</TableCell>
                            <TableCell>5</TableCell>
                            <TableCell>₽ 450,000</TableCell>
                            <TableCell>15.05.2024</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>#002</TableCell>
                            <TableCell>Монитор Samsung</TableCell>
                            <TableCell>12</TableCell>
                            <TableCell>₽ 180,000</TableCell>
                            <TableCell>14.05.2024</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>#003</TableCell>
                            <TableCell>Клавиатура Logitech</TableCell>
                            <TableCell>25</TableCell>
                            <TableCell>₽ 75,000</TableCell>
                            <TableCell>13.05.2024</TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </TabsContent>
                    <TabsContent value="inventory">
                      <p className="text-center py-12 text-muted-foreground">Данные инвентаризации загружаются...</p>
                    </TabsContent>
                    <TabsContent value="budget">
                      <p className="text-center py-12 text-muted-foreground">Бюджетные данные загружаются...</p>
                    </TabsContent>
                    <TabsContent value="reports">
                      <p className="text-center py-12 text-muted-foreground">Отчеты загружаются...</p>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'users' && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-bold">Управление пользователями</h2>
                  <p className="text-muted-foreground mt-1">Настройка прав доступа и ролей</p>
                </div>
                <Button className="gap-2">
                  <Icon name="UserPlus" size={18} />
                  Добавить пользователя
                </Button>
              </div>

              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Список пользователей</CardTitle>
                    <Input placeholder="Поиск..." className="w-64" />
                  </div>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Пользователь</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Роль</TableHead>
                        <TableHead>Статус</TableHead>
                        <TableHead>Действия</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockUsers.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Avatar>
                                <AvatarFallback className="bg-primary text-primary-foreground">
                                  {user.initials}
                                </AvatarFallback>
                              </Avatar>
                              <span className="font-medium">{user.name}</span>
                            </div>
                          </TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>
                            <Badge className={getRoleBadgeColor(user.role)}>
                              {user.role === 'admin' ? 'Администратор' : user.role === 'editor' ? 'Редактор' : 'Наблюдатель'}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Switch checked={user.active} />
                              <span className="text-sm">{user.active ? 'Активен' : 'Неактивен'}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Button variant="ghost" size="sm">
                                <Icon name="Edit" size={16} />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Icon name="Trash2" size={16} />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Права доступа</CardTitle>
                  <CardDescription>Настройка уровней доступа для ролей</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-medium">Загрузка файлов</p>
                        <p className="text-sm text-muted-foreground">Разрешить загружать новые файлы</p>
                      </div>
                      <div className="flex gap-4">
                        <div className="flex items-center gap-2">
                          <Switch checked />
                          <span className="text-sm">Admin</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Switch checked />
                          <span className="text-sm">Editor</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Switch />
                          <span className="text-sm">Viewer</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-medium">Редактирование данных</p>
                        <p className="text-sm text-muted-foreground">Изменение записей в таблицах</p>
                      </div>
                      <div className="flex gap-4">
                        <div className="flex items-center gap-2">
                          <Switch checked />
                          <span className="text-sm">Admin</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Switch checked />
                          <span className="text-sm">Editor</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Switch />
                          <span className="text-sm">Viewer</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-medium">Удаление файлов</p>
                        <p className="text-sm text-muted-foreground">Удаление загруженных документов</p>
                      </div>
                      <div className="flex gap-4">
                        <div className="flex items-center gap-2">
                          <Switch checked />
                          <span className="text-sm">Admin</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Switch />
                          <span className="text-sm">Editor</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Switch />
                          <span className="text-sm">Viewer</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-medium">Экспорт данных</p>
                        <p className="text-sm text-muted-foreground">Выгрузка итоговых таблиц</p>
                      </div>
                      <div className="flex gap-4">
                        <div className="flex items-center gap-2">
                          <Switch checked />
                          <span className="text-sm">Admin</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Switch checked />
                          <span className="text-sm">Editor</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Switch checked />
                          <span className="text-sm">Viewer</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}