import { LogisticsService } from "@/features/logistics/service/logisticsService"
import { Logistics, LogisticsSettingFormData, LogisticsSettingTypes, LogisticsViewModel } from "@/features/logistics/types/logistics"
import { getLogisticsTypeOptions } from "@/features/logistics/utils/typeConverter"
import { DeleteButton, SaveButton, ToggleButton, UpdateButton } from "@/shared/components/button/Button"
import Form from "@/shared/components/form/Form"
import FormField from "@/shared/components/form/FormField"
import Spacing from "@/shared/components/spacing/Spacing"
import Table from "@/shared/components/table/Table"
import TableBody from "@/shared/components/table/TableBody"
import TableCell from "@/shared/components/table/TableCell"
import TableColumn from "@/shared/components/table/TableColumn"
import TableHead from "@/shared/components/table/TableHead"
import TableRow from "@/shared/components/table/TableRow"
import Toast from "@/shared/components/toast/Toast"
import { usePlatformStore } from "@/store/platformStore"
import React, { useEffect, useState } from "react"
import "./logisticsSettingPage.css"

const LogisticsSettingPage = () => {
    const platforms = usePlatformStore((state) => state.platforms);
    const typeOptions = getLogisticsTypeOptions();
    const [logisticsList, setLogisticsList] = useState<LogisticsViewModel[]>([]);

    const [formData, setFormData] = useState<LogisticsSettingFormData>({
        platform: undefined,
        code: '',
        name: '',
        type: LogisticsSettingTypes.POINT,
        point: undefined,
        description: '',
        sortOrder: 0
      });

    const [toast, setToast] = useState<{
        show: boolean;
        message: string;
        type: 'success' | 'error' | 'info';
        }>({
            show: false,
            message: '',
            type: 'error'
        });

    const [selectedId, setSelectedId] = useState<number | undefined>(undefined);

    const showToast = (message: string, type: 'success' | 'error' | 'info' = 'error') => {
        setToast({ show: true, message, type });
    };

    const loadLogistics = async () => {
        try {
            const data = await LogisticsService.getAll();
            setLogisticsList(data);
        } catch (error) {
        console.error('Load Logistics Error:', error);
        }
    };

    // 초기 데이터 로드
    useEffect(() => {
        loadLogistics();
    }, []);

    // platforms 데이터가 로드되면 formData 업데이트
    useEffect(() => {
        if (platforms.length > 0 && !formData.platform) {
        setFormData(prev => ({
            ...prev,
            platform: platforms[0].id
            }));
        }
    }, [platforms]);

  // 현재 선택된 플랫폼의 POINT 타입 물류 정의들만 필터링
    const availablePoints = logisticsList.filter(item => 
        item.platform_id === Number(formData.platform) && 
        item.type === LogisticsSettingTypes.POINT
    );

    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
    
        // number 타입인 경우 앞의 0 제거
        const processedValue = e.target.type === 'number' ? 
            value.replace(/^0+/, '') || '0' : value;
    
        setFormData(prevData => ({ ...prevData, [id]: processedValue }));
    }

    const handleRowClick = (logistics: Logistics) => {
        setSelectedId(logistics.id);
        setFormData({
            platform: logistics.platform_id,
            code: logistics.code,
            name: logistics.name,
            type: logistics.type,
            point: logistics.point_id ? Number(logistics.point_id) : undefined,
            description: logistics.description,
            sortOrder: logistics.sort_order
        });
    }

    const handleSave = async () => {
        if (!formData.platform) {
            showToast('플랫폼을 선택해주세요.', 'error');
            return;
        }
        if (!formData.code) {
            showToast('코드를 입력해주세요.', 'error');
            return;
        }
        if (!formData.name) {
            showToast('이름을 입력해주세요.', 'error');
            return;
        }
        if (!formData.type) {
            showToast('타입을 선택해주세요.', 'error');
            return;
        }
        if (formData.type === LogisticsSettingTypes.STATUS && !formData.point) {
            showToast('대상을 선택해주세요.', 'error');
            return;
        }
        if (formData.sortOrder < 0) {
            showToast('순서는 1 이상이어야 합니다.', 'error');
            return;
        }

        try {
            const logisticsData = convertFormDataToLogistics(formData);
            
            if (selectedId) {
                await LogisticsService.update(selectedId, logisticsData);
                showToast('성공적으로 수정되었습니다.', 'success');
            } else {
                await LogisticsService.create(logisticsData);
                showToast('성공적으로 저장되었습니다.', 'success');
            }
            
            await loadLogistics();
            // 폼 초기화
            setSelectedId(undefined);
            setFormData({
                platform: platforms[0].id,
                code: '',
                name: '',
                type: LogisticsSettingTypes.POINT,
                point: undefined,
                description: '',
                sortOrder: 0
            });
        } catch (error) {
            showToast(selectedId ? '수정에 실패했습니다.' : '저장에 실패했습니다.', 'error');
        }
    }

    const handleDelete = async (e: React.MouseEvent<HTMLButtonElement>, id: number) => {
        e.stopPropagation();
        try {
            await LogisticsService.delete(id);
            await loadLogistics();
            showToast('성공적으로 삭제되었습니다.', 'success');
        } catch (error) {
            showToast('삭제에 실패했습니다.', 'error');
            console.error('Delete Error:', error);
        }
    }

    const handleToggle = async (e: React.MouseEvent<HTMLButtonElement>, id: number) => {
        e.stopPropagation();
        try {
            // POINT 타입 찾기
            const point = logisticsList.find(item => item.id === id);
            
            if (point) {
                // POINT 타입인 경우
                const newIsActive = !point.is_active;
                
                // 하위 상태들도 모두 변경
                if (point.statuses && point.statuses.length > 0) {
                    await Promise.all(
                        point.statuses.map(status => 
                            LogisticsService.toggleActive(status.id, newIsActive)
                        )
                    );
                }

                await LogisticsService.toggleActive(id, newIsActive);
            } else {
                // STATUS 타입인 경우
                const parentPoint = logisticsList.find(item => 
                    item.statuses?.some(status => status.id === id)
                );
                const status = parentPoint?.statuses?.find(status => status.id === id);
                
                if (status) {
                    await LogisticsService.toggleActive(id, !status.is_active);
                }
            }
            
            await loadLogistics();
            showToast('상태가 변경되었습니다.', 'success');
        } catch (error) {
            showToast('상태 변경에 실패했습니다.', 'error');
            console.error('Toggle Error:', error);
        }
    }

    const convertFormDataToLogistics = (formData: LogisticsSettingFormData) : Omit<Logistics, 'id'> => {
        if (!formData.platform) {
            showToast('플랫폼을 선택해주세요.', 'error');
            throw new Error('플랫폼을 선택해주세요.');
        }
        return {
            platform_id: formData.platform,
            code: formData.code,
            name: formData.name,
            type: formData.type,
            point_id: formData.point ? Number(formData.point) : undefined,
            description: formData.description,
            sort_order: formData.sortOrder,
            is_active: true,
        }
    }

    const renderLogisticsRow = (logistics: LogisticsViewModel, level: number = 0): JSX.Element => {
        return (
            <React.Fragment key={logistics.id}>
                <TableRow 
                    onClick={() => handleRowClick(logistics)}
                >
                    <TableCell>{platforms.find(p => p.id === logistics.platform_id)?.name}</TableCell>
                    <TableCell>{logistics.code}</TableCell>
                    <TableCell>
                        <span style={{ marginLeft: `${level * 1}rem` }}>
                        {logistics.name}
                        </span>
                    </TableCell>
                    <TableCell>{logistics.type === LogisticsSettingTypes.POINT ? '물류 단계' : '상태'}</TableCell>
                    <TableCell>{logistics.description}</TableCell>
                    <TableCell>{logistics.sort_order}</TableCell>
                    <TableCell
                        className="button-cell"
                    >
                        <ToggleButton 
                            isActive={logistics.is_active} 
                            onToggle={(e) => handleToggle(e, logistics.id)} 
                        />
                        <DeleteButton onClick={(e) => handleDelete(e, logistics.id)} />
                    </TableCell>
                </TableRow>
                {logistics.statuses?.map((status: LogisticsViewModel) => renderLogisticsRow(status, level + 1))}
            </React.Fragment>
        );
    };

    return (
        <>
            <Spacing height="2rem" />
            <div className="setting-page">
                <div className="table-part">
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableColumn>플랫폼</TableColumn>
                                <TableColumn>코드</TableColumn>
                                <TableColumn>이름</TableColumn>
                                <TableColumn>타입</TableColumn>
                                <TableColumn>설명</TableColumn>
                                <TableColumn>정렬 순서</TableColumn>
                                <TableColumn>상태</TableColumn>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {logisticsList
                                .filter(item => item.type === LogisticsSettingTypes.POINT)
                                .map(logistics => renderLogisticsRow(logistics))}
                        </TableBody>
                    </Table>
                </div>
                <div className="form-part">
                    <Form>
                        <FormField
                            label="플랫폼"
                            htmlFor="platform"
                            required
                        >
                            <select id="platform" value={formData.platform} onChange={(e) => {
                                    setFormData({...formData, platform: Number(e.target.value)})
                                }}>
                                {platforms.length > 0 ? platforms.map(platform => (
                                    <option key={platform.id} value={platform.id}>
                                        {platform.name}
                                    </option>
                                )) : <option value="">플랫폼 정의가 필요합니다.</option>}
                            </select>
                        </FormField>
                        <FormField
                            label="코드"
                            htmlFor="code"
                            required
                        >
                            <input 
                                type="text" 
                                id="code" 
                                value={formData.code}
                                onChange={handleFormChange}
                            />
                        </FormField>
                        <FormField
                            label="이름"
                            htmlFor="name"
                            required
                        >
                            <input 
                                type="text" 
                                id="name" 
                                value={formData.name}
                                onChange={handleFormChange}
                            />
                        </FormField>
                        <FormField
                            label="타입"
                            htmlFor="type"
                            required
                        >
                            <select id="type" value={formData.type} onChange={(e) => {
                                    setFormData({...formData, type: e.target.value as LogisticsSettingTypes})
                                }}>
                                {typeOptions.map(({key, value, label}) => (
                                    <option key={key} value={value}>
                                        {label}
                                    </option>
                                ))}
                            </select>
                        </FormField>
                        {formData.type === LogisticsSettingTypes.STATUS && (
                            <FormField
                                label="대상"
                                htmlFor="point"
                                required
                            >
                                <select 
                                    id="point" 
                                    value={formData.point}
                                    onChange={(e) => setFormData({...formData, point: Number(e.target.value)})}
                                >
                                    <option value="">선택하세요</option>
                                    {availablePoints.map(point => (
                                        <option key={point.id} value={point.id}>
                                            {point.name}
                                        </option>
                                    ))}
                                </select>
                            </FormField>
                        )}
                        <FormField
                            label="설명"
                            htmlFor="description"
                        >
                            <input 
                                type="text" 
                                id="description" 
                                value={formData.description}
                                onChange={handleFormChange}
                            />
                        </FormField>
                        <FormField
                            label="순서"
                            htmlFor="sortOrder"
                            required
                        >
                            <input 
                                type="number" 
                                id="sortOrder" 
                                value={formData.sortOrder}
                                onChange={handleFormChange}
                            />
                        </FormField>
                        <Spacing height="1rem" />   
                        {selectedId ? <UpdateButton onClick={handleSave} /> : <SaveButton onClick={handleSave} />}
                    </Form>
                </div>
            </div>
            {toast.show && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(prev => ({ ...prev, show: false }))}
                />
            )}
        </>
  )
}

export default LogisticsSettingPage